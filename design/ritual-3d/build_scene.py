"""Tierra Coffee: escena 3D de la seccion "Del grano a la taza" (secuencia guiada por scroll).

Reconstruye toda la escena desde cero dentro de Blender (5.x, Cycles):
granos flotando -> molido que cae al dripper -> vertido con kettle -> taza servida.

Uso:
  blender -b --python design/ritual-3d/build_scene.py -- <carpeta_salida> [frames...]
Sin lista de frames renderiza la animacion completa (0-120) como PNG con alfa;
despues `node scripts/export-ritual-frames.mjs <carpeta_salida>` genera los WebP.
Para solo abrir la escena en Blender: Scripting > abrir este archivo > Run Script.
Los colores de marca salen de brand-assets/tokens/tokens.json.
"""
import json
import math
import os
import random
import sys

import bmesh
import bpy
from mathutils import Vector

ARGS = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
HERE = globals().get("RITUAL_DIR") or os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.abspath(ARGS[0]) if ARGS else os.path.join(HERE, "render")
FRAME_END = 120
random.seed(11)
S = bpy.context.scene


# ---------------------------------------------------------------- utilidades
def srgb(hex_color):
    h = hex_color.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(h[i : i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, 1.0)


def brand_colors():
    path = os.path.normpath(os.path.join(HERE, "..", "..", "brand-assets", "tokens", "tokens.json"))
    text = open(path, encoding="utf-8").read()
    found = {}

    def walk(node, trail=""):
        if isinstance(node, dict):
            for k, v in node.items():
                walk(v, f"{trail}.{k}".lower())
        elif isinstance(node, str) and node.startswith("#") and len(node) == 7:
            found[trail] = node

    walk(json.loads(text))
    aqua = next(v for k, v in found.items() if "aqua" in k)
    crimson = next(v for k, v in found.items() if "crimson" in k)
    return srgb(aqua), srgb(crimson)


def clear_scene():
    for ob in list(bpy.data.objects):
        bpy.data.objects.remove(ob, do_unlink=True)
    for coll in (bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.lights, bpy.data.cameras, bpy.data.actions):
        for block in list(coll):
            if block.users == 0:
                coll.remove(block)


def link(ob):
    S.collection.objects.link(ob)
    return ob


def empty(name, loc=(0, 0, 0)):
    ob = bpy.data.objects.new(name, None)
    ob.location = loc
    ob.empty_display_size = 0.2
    return link(ob)


def lathe(name, profile, mat=None, seg=64, subdiv=2, flute=None):
    """Solido de revolucion alrededor de Z a partir de un perfil [(radio, z), ...].

    `flute(z, angulo)` devuelve una variacion relativa del radio (estrias, pliegues).
    """
    bm = bmesh.new()
    rings = []
    for r, z in profile:
        if r < 1e-6:
            rings.append([bm.verts.new((0, 0, z))])
        else:
            ring = []
            for i in range(seg):
                a = 2 * math.pi * i / seg
                rr = r * (1 + flute(z, a)) if flute else r
                ring.append(bm.verts.new((rr * math.cos(a), rr * math.sin(a), z)))
            rings.append(ring)
    for a, b in zip(rings, rings[1:]):
        if len(a) == 1 and len(b) == 1:
            continue
        for i in range(seg):
            j = (i + 1) % seg
            if len(a) == 1:
                bm.faces.new((a[0], b[i], b[j]))
            elif len(b) == 1:
                bm.faces.new((a[i], a[j], b[0]))
            else:
                bm.faces.new((a[i], a[j], b[j], b[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    ob = link(bpy.data.objects.new(name, me))
    if subdiv:
        mod = ob.modifiers.new("Subdiv", "SUBSURF")
        mod.levels = subdiv
        mod.render_levels = subdiv
    if mat:
        me.materials.append(mat)
    return ob


def tube(name, points, radius, mat=None, radii=None, res=24):
    """Tubo sobre una curva Bezier que pasa por `points`."""
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = radius
    cu.bevel_resolution = 8
    cu.resolution_u = res
    cu.use_fill_caps = True
    sp = cu.splines.new("BEZIER")
    sp.bezier_points.add(len(points) - 1)
    for i, (bp, p) in enumerate(zip(sp.bezier_points, points)):
        bp.co = p
        bp.handle_left_type = bp.handle_right_type = "AUTO"
        if radii:
            bp.radius = radii[i]
    ob = link(bpy.data.objects.new(name, cu))
    if mat:
        cu.materials.append(mat)
    return ob


def key(ob, frame, loc=None, rot=None, scale=None):
    if loc is not None:
        ob.location = loc
        ob.keyframe_insert("location", frame=frame)
    if rot is not None:
        ob.rotation_euler = rot
        ob.keyframe_insert("rotation_euler", frame=frame)
    if scale is not None:
        ob.scale = (scale, scale, scale) if isinstance(scale, (int, float)) else scale
        ob.keyframe_insert("scale", frame=frame)


# ---------------------------------------------------------------- materiales
def sock(sockets, ident):
    for s in sockets:
        if s.identifier == ident or s.name == ident:
            return s
    raise KeyError(ident)


def new_material(name):
    m = bpy.data.materials.new(name)
    try:
        m.use_nodes = True
    except Exception:
        pass
    nt = m.node_tree
    bsdf = next((n for n in nt.nodes if n.type == "BSDF_PRINCIPLED"), None)
    if bsdf is None:
        out = next((n for n in nt.nodes if n.type == "OUTPUT_MATERIAL"), None) or nt.nodes.new("ShaderNodeOutputMaterial")
        bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
        nt.links.new(bsdf.outputs[0], sock(out.inputs, "Surface"))
    return m, nt, bsdf


def setv(bsdf, **values):
    for name, value in values.items():
        s = bsdf.inputs.get(name.replace("_", " "))
        if s is not None:
            s.default_value = value


def mix_color(nt, fac, a, b):
    n = nt.nodes.new("ShaderNodeMix")
    n.data_type = "RGBA"
    for ident, v in (("Factor_Float", fac), ("A_Color", a), ("B_Color", b)):
        s = sock(n.inputs, ident)
        if hasattr(v, "is_linked") or hasattr(v, "links"):
            nt.links.new(v, s)
        else:
            s.default_value = v
    return sock(n.outputs, "Result_Color")


def noise(nt, scale, detail=2.0, rough=0.5, coords=None):
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = scale
    n.inputs["Detail"].default_value = detail
    n.inputs["Roughness"].default_value = rough
    if coords is not None:
        nt.links.new(coords, n.inputs["Vector"])
    return n.outputs[0]


def ramp(nt, value, stops):
    n = nt.nodes.new("ShaderNodeValToRGB")
    els = n.color_ramp.elements
    while len(els) < len(stops):
        els.new(0.5)
    for el, (pos, col) in zip(els, stops):
        el.position = pos
        el.color = col
    nt.links.new(value, n.inputs[0])
    return n.outputs[0]


def bump(nt, bsdf, height, strength=0.2, distance=0.02):
    n = nt.nodes.new("ShaderNodeBump")
    n.inputs["Strength"].default_value = strength
    n.inputs["Distance"].default_value = distance
    nt.links.new(height, n.inputs["Height"])
    nt.links.new(n.outputs[0], bsdf.inputs["Normal"])


def object_coords(nt):
    return nt.nodes.new("ShaderNodeTexCoord").outputs["Object"]


CREAM = (0.72, 0.66, 0.54, 1)
SPECK = (0.20, 0.13, 0.08, 1)


def mat_ceramic(name, glaze=None, below=None, above=None, wobble=0.05):
    """Gres crema moteado. `glaze` cubre lo que queda bajo `below` o sobre `above` (Z local)."""
    m, nt, bsdf = new_material(name)
    co = object_coords(nt)
    specks = ramp(nt, noise(nt, 70, 3, 0.6, co), [(0.66, (0, 0, 0, 1)), (0.70, (1, 1, 1, 1))])
    tone = mix_color(nt, noise(nt, 4, 2, 0.5, co), CREAM, (0.78, 0.73, 0.62, 1))
    body = mix_color(nt, specks, tone, SPECK)
    setv(bsdf, Roughness=0.3, Coat_Weight=0.3, Coat_Roughness=0.12)
    if glaze is None:
        nt.links.new(body, bsdf.inputs["Base Color"])
    else:
        sep = nt.nodes.new("ShaderNodeSeparateXYZ")
        nt.links.new(co, sep.inputs[0])
        wob = nt.nodes.new("ShaderNodeMath")
        wob.operation = "MULTIPLY_ADD"
        nt.links.new(noise(nt, 5, 2, 0.5, co), wob.inputs[0])
        wob.inputs[1].default_value = wobble
        nt.links.new(sep.outputs["Z"], wob.inputs[2])
        edge = nt.nodes.new("ShaderNodeMath")
        edge.operation = "LESS_THAN" if below is not None else "GREATER_THAN"
        nt.links.new(wob.outputs[0], edge.inputs[0])
        edge.inputs[1].default_value = (below if below is not None else above) + wobble / 2
        nt.links.new(mix_color(nt, edge.outputs[0], body, glaze), bsdf.inputs["Base Color"])
        rough = nt.nodes.new("ShaderNodeMapRange")
        nt.links.new(edge.outputs[0], rough.inputs[0])
        rough.inputs[3].default_value = 0.3
        rough.inputs[4].default_value = 0.12
        nt.links.new(rough.outputs[0], bsdf.inputs["Roughness"])
    bump(nt, bsdf, noise(nt, 30, 3, 0.6, co), 0.06, 0.01)
    return m


def mat_bean():
    m, nt, bsdf = new_material("Bean")
    co = object_coords(nt)
    col = mix_color(nt, noise(nt, 3.5, 3, 0.6, co), (0.034, 0.013, 0.006, 1), (0.088, 0.037, 0.016, 1))
    nt.links.new(col, bsdf.inputs["Base Color"])
    setv(bsdf, Roughness=0.38, Coat_Weight=0.35, Coat_Roughness=0.25)
    bump(nt, bsdf, noise(nt, 26, 4, 0.65, co), 0.25, 0.02)
    return m


def mat_grounds(name="Grounds", bump_scale=220):
    m, nt, bsdf = new_material(name)
    co = object_coords(nt)
    col = mix_color(nt, noise(nt, 90, 2, 0.6, co), (0.035, 0.016, 0.008, 1), (0.13, 0.06, 0.028, 1))
    nt.links.new(col, bsdf.inputs["Base Color"])
    setv(bsdf, Roughness=0.9)
    bump(nt, bsdf, noise(nt, bump_scale, 3, 0.7, co), 1.0, 0.03)
    return m


def mat_simple(name, color, rough=0.5, **extra):
    m, nt, bsdf = new_material(name)
    bsdf.inputs["Base Color"].default_value = color
    setv(bsdf, Roughness=rough, **extra)
    return m


def mat_enamel(name, color):
    m, nt, bsdf = new_material(name)
    co = object_coords(nt)
    nt.links.new(mix_color(nt, noise(nt, 2.5, 2, 0.5, co), color, tuple(c * 0.86 for c in color[:3]) + (1,)), bsdf.inputs["Base Color"])
    setv(bsdf, Roughness=0.26, Coat_Weight=0.7, Coat_Roughness=0.06)
    bump(nt, bsdf, noise(nt, 40, 2, 0.5, co), 0.03, 0.01)
    return m


def mat_wood():
    m, nt, bsdf = new_material("Wood")
    co = object_coords(nt)
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1.0, 14.0, 14.0)
    nt.links.new(co, mp.inputs["Vector"])
    grain = noise(nt, 3.0, 5, 0.6, mp.outputs[0])
    col = ramp(nt, grain, [(0.30, (0.30, 0.16, 0.07, 1)), (0.70, (0.52, 0.33, 0.17, 1))])
    nt.links.new(col, bsdf.inputs["Base Color"])
    setv(bsdf, Roughness=0.5)
    bump(nt, bsdf, grain, 0.12, 0.01)
    return m


def mat_paper():
    m, nt, bsdf = new_material("Paper")
    co = object_coords(nt)
    # Papel sin blanquear: contrasta con la ceramica crema
    fibre = mix_color(nt, noise(nt, 55, 4, 0.7, co), (0.56, 0.41, 0.25, 1), (0.70, 0.55, 0.37, 1))
    nt.links.new(fibre, bsdf.inputs["Base Color"])
    setv(bsdf, Roughness=0.8, Subsurface_Weight=0.25, Subsurface_Scale=0.02)
    bump(nt, bsdf, noise(nt, 120, 3, 0.7, co), 0.3, 0.008)
    return m


def mat_coffee():
    m, nt, bsdf = new_material("Coffee")
    co = object_coords(nt)
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(co, sep.inputs[0])
    length = nt.nodes.new("ShaderNodeVectorMath")
    length.operation = "LENGTH"
    comb = nt.nodes.new("ShaderNodeCombineXYZ")
    nt.links.new(sep.outputs["X"], comb.inputs["X"])
    nt.links.new(sep.outputs["Y"], comb.inputs["Y"])
    nt.links.new(comb.outputs[0], length.inputs[0])
    wob = nt.nodes.new("ShaderNodeMath")
    wob.operation = "MULTIPLY_ADD"
    nt.links.new(noise(nt, 9, 3, 0.6, co), wob.inputs[0])
    wob.inputs[1].default_value = 0.03
    nt.links.new(length.outputs["Value"], wob.inputs[2])
    col = ramp(
        nt,
        wob.outputs[0],
        [(0.325, (0.030, 0.011, 0.004, 1)), (0.372, (0.115, 0.045, 0.014, 1)), (0.392, (0.42, 0.22, 0.09, 1))],
    )
    nt.links.new(col, bsdf.inputs["Base Color"])
    setv(bsdf, Roughness=0.04, IOR=1.34)
    return m


def mat_water():
    m, nt, bsdf = new_material("Water")
    bsdf.inputs["Base Color"].default_value = (0.93, 0.97, 0.98, 1)
    setv(bsdf, Roughness=0.0, IOR=1.33, Transmission_Weight=1.0)
    return m


# ---------------------------------------------------------------- modelos
def bean_mesh():
    """Grano de cafe: elipsoide con cara plana y surco en S."""
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=96, v_segments=48, radius=1.0)
    for v in bm.verts:
        x, y, z = v.co
        flat = z < 0
        px, py = x * 0.5, y * 0.36
        pz = z * (0.10 if flat else 0.27)
        if flat:
            centre = 0.035 * math.sin(px * 2 * math.pi * 0.9)
            groove = math.exp(-(((py - centre) / 0.03) ** 2)) * max(0.0, 1 - (abs(px) / 0.47) ** 6)
            pz += 0.075 * groove
            # Borde redondeado hacia el surco
            pz -= 0.02 * math.exp(-(((py - centre) / 0.09) ** 2)) * max(0.0, 1 - (abs(px) / 0.5) ** 4)
        v.co = (px, py, pz)
    me = bpy.data.meshes.new("Bean")
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    return me


def ground_meshes(count=4):
    meshes = []
    for i in range(count):
        bm = bmesh.new()
        bmesh.ops.create_icosphere(bm, subdivisions=1, radius=1.0)
        for v in bm.verts:
            v.co *= random.uniform(0.6, 1.15)
        me = bpy.data.meshes.new(f"Ground{i}")
        bm.to_mesh(me)
        bm.free()
        meshes.append(me)
    return meshes


def build():
    clear_scene()
    aqua, crimson = brand_colors()

    m_cup = mat_ceramic("CeramicDip", aqua, below=0.30)
    m_dripper = mat_ceramic("CeramicRim", aqua, above=1.612, wobble=0.006)
    m_steel = mat_simple("Steel", (0.80, 0.80, 0.82, 1), 0.2, Metallic=1.0)
    m_foam = mat_grounds("Bloom", 260)
    m_ceramic = mat_ceramic("Ceramic")
    m_bean = mat_bean()
    m_grounds = mat_grounds()
    m_bed = mat_grounds("GroundsBed", 150)
    m_kettle = mat_enamel("KettleEnamel", aqua)
    m_knob = mat_simple("Knob", crimson, 0.35, Coat_Weight=0.3)
    m_wood = mat_wood()
    m_paper = mat_paper()
    m_coffee = mat_coffee()
    m_water = mat_water()

    # --- Suelo (solo recibe sombras) y posavasos de madera
    bm = bmesh.new()
    bmesh.ops.create_circle(bm, cap_ends=True, segments=64, radius=7.0)
    me = bpy.data.meshes.new("Floor")
    bm.to_mesh(me)
    bm.free()
    floor = link(bpy.data.objects.new("Floor", me))
    floor.location.z = -0.05
    floor.is_shadow_catcher = True
    lathe("Coaster", [(0, -0.05), (0.60, -0.05), (0.62, -0.04), (0.62, -0.01), (0.60, 0.0), (0, 0.0)], m_wood, subdiv=1)

    # --- Taza (yunomi)
    cup_profile = [
        (0, 0.0), (0.25, 0.0), (0.285, 0.015), (0.30, 0.07), (0.355, 0.33), (0.40, 0.60), (0.42, 0.82), (0.422, 0.86),
        (0.412, 0.878), (0.396, 0.876), (0.386, 0.86), (0.38, 0.80), (0.362, 0.60), (0.318, 0.33), (0.26, 0.10),
        (0.17, 0.062), (0, 0.055),
    ]
    lathe("Cup", cup_profile, m_cup)
    lathe("CoffeeSurface", [(0, 0.80), (0.2, 0.80), (0.36, 0.80), (0.379, 0.80)], m_coffee, subdiv=0)

    # --- Dripper + filtro + cama de cafe molido
    rig_dripper = empty("DripperRig")
    def cone_r(z):
        return 0.19 + 0.41 * (z - 0.935) / 0.665

    def flutes(z, a):
        fade = min(1.0, max(0.0, (z - 0.98) / 0.1)) * min(1.0, max(0.0, (1.585 - z) / 0.04))
        return 0.022 * fade * math.cos(22 * a)

    cone = [(cone_r(z), z) for z in (0.935, 0.98, 1.08, 1.2, 1.32, 1.44, 1.545, 1.585, 1.60)]
    dripper = lathe(
        "Dripper",
        [(0.105, 0.80), (0.13, 0.875), (0.55, 0.88), (0.575, 0.895), (0.575, 0.915), (0.55, 0.93), *cone,
         (0.625, 1.635), (0.615, 1.655), (0.59, 1.64), (0.145, 0.915), (0.08, 0.80), (0.105, 0.80)],
        m_dripper,
        seg=176,
        subdiv=1,
        flute=flutes,
    )
    handle = tube("DripperHandle", [(-0.42, 0, 1.36), (-0.78, 0, 1.40), (-0.86, 0, 1.18), (-0.62, 0, 1.02), (-0.27, 0, 1.03)], 0.04, m_ceramic)

    def pleats(z, a):
        return 0.012 * min(1.0, max(0.0, (z - 1.2) / 0.4)) * math.cos(40 * a)

    paper = lathe("Filter", [(0.03, 0.80), (0.14, 0.93), (0.36, 1.29), (0.50, 1.52), (0.585, 1.655), (0.612, 1.725)], m_paper,
                  seg=160, subdiv=1, flute=pleats)

    apex_z = 0.70
    bed = lathe(
        "GroundsBed",
        [(0, 1.60 - apex_z), (0.12, 1.60 - apex_z), (0.25, 1.59 - apex_z), (0.38, 1.572 - apex_z), (0.47, 1.552 - apex_z),
         (0.508, 1.53 - apex_z)],
        m_bed,
        seg=96,
        subdiv=2,
    )
    bed.location.z = apex_z
    rough = bpy.data.textures.new("GroundsNoise", "CLOUDS")
    rough.noise_scale = 0.05
    displace = bed.modifiers.new("Displace", "DISPLACE")
    displace.texture = rough
    displace.strength = 0.03
    crumb_me = ground_meshes(3)
    for me in crumb_me:
        me.materials.append(m_grounds)
    for k in range(90):
        crumb = link(bpy.data.objects.new(f"Crumb{k:02d}", random.choice(crumb_me)))
        ang, rad = random.uniform(0, 6.283), 0.46 * math.sqrt(random.random())
        crumb.location = (rad * math.cos(ang), rad * math.sin(ang), 1.605 - apex_z - 0.07 * (rad / 0.46) ** 2)
        crumb.rotation_euler = [random.uniform(0, 6.28) for _ in range(3)]
        size = random.uniform(0.01, 0.026)
        crumb.scale = (size, size, size)
        crumb.parent = bed
    # Bloom: la espuma que levanta el agua al caer
    bloom = lathe("Bloom", [(0, 1.632 - apex_z), (0.1, 1.63 - apex_z), (0.19, 1.618 - apex_z), (0.235, 1.60 - apex_z)], m_foam,
                  seg=64, subdiv=1)
    bloom.parent = bed
    key(bloom, 74, scale=0.001)
    key(bloom, 88, scale=1.0)
    for ob in (dripper, handle, paper, bed):
        ob.parent = rig_dripper

    # --- Granos
    bean_me = bean_mesh()
    bean_me.materials.append(m_bean)
    centre = Vector((0, 0, 3.30))
    specs = [
        (Vector((-0.30, 0.0, 3.36)), (-1.32, 1.15, 0.22), 0.70),
        (Vector((0.31, 0.06, 3.30)), (-1.78, -1.22, -0.30), 0.66),
    ]
    ring = [(-0.78, 0.34, 0.28), (0.80, 0.40, 0.24), (-0.60, -0.58, 0.22), (0.66, -0.52, 0.28), (0.04, 0.80, 0.21),
            (-0.02, -0.78, 0.24), (-0.90, -0.14, 0.18), (0.92, -0.06, 0.20), (0.46, 0.74, 0.17)]
    for x, z, s in ring:
        pos = centre + Vector((x, random.uniform(-0.45, 0.55), z))
        specs.append((pos, tuple(random.uniform(0, 6.28) for _ in range(3)), s))

    ground_me = ground_meshes()
    for me in ground_me:
        me.materials.append(m_grounds)

    bed_z = 1.57
    last_land = 0
    for i, (pos, rot, s) in enumerate(specs):
        ob = link(bpy.data.objects.new(f"Bean{i:02d}", bean_me))
        spin = [random.uniform(-0.5, 0.5) for _ in range(3)]
        f_fall = 16 + (0 if i < 2 else random.randint(0, 6))
        f_crumble = f_fall + random.randint(11, 14)
        drift = Vector((random.uniform(-0.03, 0.03), 0, random.uniform(-0.05, 0.05)))
        crumble_pos = Vector((pos.x * 0.55, pos.y * 0.5, 2.50 + (pos.z - centre.z) * 0.35))
        key(ob, 0, loc=pos, rot=rot, scale=s)
        key(ob, f_fall, loc=pos + drift, rot=[r + d for r, d in zip(rot, spin)])
        key(ob, f_crumble, loc=crumble_pos, rot=[r + d * 4 for r, d in zip(rot, spin)], scale=s)
        key(ob, f_crumble + 4, loc=crumble_pos - Vector((0, 0, 0.3)), scale=0.001)

        for j in range(int(60 * s) + 8):
            g = link(bpy.data.objects.new(f"Ground{i:02d}_{j:02d}", random.choice(ground_me)))
            gs = random.uniform(0.014, 0.034) * (1.6 if random.random() < 0.12 else 1)
            start = crumble_pos + Vector([random.gauss(0, 0.33 * s) for _ in range(3)])
            ang, rad = random.uniform(0, 6.283), 0.40 * math.sqrt(random.random())
            target = Vector((rad * math.cos(ang), rad * math.sin(ang), bed_z + random.uniform(-0.02, 0.04)))
            f0 = f_crumble + random.randint(-1, 2)
            f1 = f0 + random.randint(11, 19)
            mid = start.lerp(target, 0.5)
            mid.z = start.z + (target.z - start.z) * 0.24
            mid += Vector((random.gauss(0, 0.07), random.gauss(0, 0.07), 0))
            g.rotation_euler = [random.uniform(0, 6.28) for _ in range(3)]
            key(g, f0 - 1, loc=start, scale=0.0001)
            key(g, f0 + 2, scale=gs)
            key(g, (f0 + f1) // 2, loc=mid)
            key(g, f1, loc=target, scale=gs)
            key(g, f1 + 2, scale=0.0001)
            last_land = max(last_land, f1)

    key(bed, 30, scale=0.001)
    key(bed, 34, scale=0.22)
    key(bed, last_land + 1, scale=1.0)
    key(bed, 74, scale=1.0)
    key(bed, 88, scale=1.035)

    # --- Granos sueltos junto a la taza
    for k, (x, y, rz, flip) in enumerate([(0.66, -0.40, 0.6, 0), (0.83, -0.13, 2.3, math.pi), (-0.70, -0.46, 4.0, 0)]):
        ob = link(bpy.data.objects.new(f"BeanRest{k}", bean_me))
        ob.scale = (0.2, 0.2, 0.2)
        ob.location = (x, y, -0.05 + (0.02 if not flip else 0.054))
        ob.rotation_euler = (flip, 0, rz)

    # --- Kettle de cuello de ganso
    K = 0.80
    tip_local = Vector((-1.34, 0, 1.00))
    rig_kettle = empty("KettleRig")
    kettle = empty("Kettle")
    kettle.parent = rig_kettle
    kettle.scale = (K, K, K)
    kettle.location = -tip_local * K
    handle_path = [(0.47, 0, 0.80), (0.86, 0, 0.90), (1.06, 0, 0.62), (0.98, 0, 0.30), (0.66, 0, 0.10)]
    grip = tube("KettleGrip", handle_path, 0.052, m_wood)
    grip.data.bevel_factor_start, grip.data.bevel_factor_end = 0.24, 0.80
    parts = [
        lathe("KettleBody", [(0, 0), (0.60, 0), (0.655, 0.02), (0.665, 0.08), (0.52, 0.76), (0.47, 0.85), (0.41, 0.875),
                             (0.40, 0.86), (0.2, 0.86), (0, 0.86)], m_kettle),
        lathe("KettleBase", [(0.62, -0.012), (0.672, -0.004), (0.679, 0.03), (0.671, 0.062), (0.655, 0.066)], m_steel, subdiv=1),
        lathe("KettleRim", [(0.40, 0.868), (0.436, 0.866), (0.446, 0.880), (0.436, 0.894), (0.40, 0.892)], m_steel, subdiv=1),
        lathe("KettleLid", [(0, 0.962), (0.16, 0.957), (0.31, 0.932), (0.385, 0.905), (0.40, 0.89), (0.39, 0.882), (0, 0.882)], m_kettle),
        lathe("KettleKnobStem", [(0, 1.0), (0.024, 1.0), (0.024, 0.955), (0, 0.955)], m_steel, seg=24, subdiv=0),
        lathe("KettleKnob", [(0, 1.10), (0.05, 1.095), (0.078, 1.055), (0.062, 1.01), (0.032, 0.995), (0, 0.995)], m_knob, seg=32),
        tube("KettleSpout", [(-0.58, 0, 0.16), (-0.90, 0, 0.20), (-1.04, 0, 0.50), (-0.98, 0, 0.80), (-1.10, 0, 0.99), tuple(tip_local)],
             0.05, m_kettle, radii=[1.25, 1.1, 0.95, 0.8, 0.7, 0.6]),
        tube("KettleSpoutCollar", [(-0.55, 0, 0.158), (-0.67, 0, 0.166)], 0.086, m_steel),
        tube("KettleSpoutTip", [(-1.295, 0, 1.0), (-1.346, 0, 1.0)], 0.035, m_steel),
        tube("KettleHandle", handle_path, 0.022, m_steel),
        grip,
    ]
    for ob in parts:
        ob.parent = kettle

    # El kettle llega alto y a un lado ("ready") y baja a verter mientras se inclina:
    # asi el cuello nunca cruza el borde del dripper (lo comprueba check_clearance.py).
    tip = Vector((0.13, 0, 2.28))
    ready = Vector((0.42, 0, 2.80))
    away_in, away_out = Vector((2.9, 0, 4.1)), Vector((3.3, 0, 3.9))
    tilt = -0.50
    key(rig_kettle, 54, loc=away_in, rot=(0, 0.25, 0))
    key(rig_kettle, 66, loc=ready, rot=(0, 0.06, 0))
    key(rig_kettle, 74, loc=tip, rot=(0, tilt, 0))
    key(rig_kettle, 88, loc=tip, rot=(0, tilt, 0))
    key(rig_kettle, 95, loc=ready, rot=(0, 0.06, 0))
    key(rig_kettle, 105, loc=away_out, rot=(0, 0.3, 0))

    # --- Chorro de agua
    stream = tube("Stream", [tuple(tip + Vector((0.02, 0, 0.0))), tuple(tip + Vector((-0.07, 0, -0.07))), (0.02, 0, 1.92), (0.0, 0, 1.52)],
                  0.02, m_water, radii=[1.0, 1.0, 0.85, 0.75], res=32)
    cu = stream.data
    for frame, start, end in [(74, 0, 0), (78, 0, 1), (87, 0, 1), (90, 1, 1)]:
        cu.bevel_factor_start, cu.bevel_factor_end = start, end
        cu.keyframe_insert("bevel_factor_start", frame=frame)
        cu.keyframe_insert("bevel_factor_end", frame=frame)

    # --- Se retira el dripper
    key(rig_dripper, 96, loc=(0, 0, 0))
    key(rig_dripper, 112, loc=(0, 0, 3.6))

    # --- Camara
    aim = empty("Aim")
    cam_data = bpy.data.cameras.new("Camera")
    cam_data.lens = 70
    cam_data.sensor_width = 36
    cam = link(bpy.data.objects.new("Camera", cam_data))
    con = cam.constraints.new("TRACK_TO")
    con.target = aim
    con.track_axis = "TRACK_NEGATIVE_Z"
    con.up_axis = "UP_Y"
    S.camera = cam
    for frame, c, a in [
        (0, (0.0, -4.5, 3.55), (0, 0, 3.32)),
        (16, (0.0, -4.6, 3.50), (0, 0, 3.28)),
        (44, (0.0, -6.7, 3.85), (0.0, 0, 1.32)),
        (56, (0.0, -6.8, 3.85), (0.0, 0, 1.32)),
        (68, (0.55, -7.5, 4.05), (0.55, 0, 1.50)),
        (92, (0.55, -7.5, 4.05), (0.55, 0, 1.50)),
        (106, (0.1, -5.2, 2.9), (0.05, 0, 0.75)),
        (120, (-0.2, -3.95, 2.9), (0.0, 0, 0.42)),
    ]:
        key(cam, frame, loc=c)
        key(aim, frame, loc=a)

    setup_light_and_render()
    return "ok"


def setup_light_and_render():
    def area(name, loc, size, power, color=(1, 1, 1), shadow=True):
        li = bpy.data.lights.new(name, "AREA")
        if isinstance(size, tuple):
            li.shape = "RECTANGLE"
            li.size, li.size_y = size
        else:
            li.shape = "DISK"
            li.size = size
        li.energy = power
        li.color = color
        if not shadow:
            for owner, prop in ((li, "use_shadow"), (getattr(li, "cycles", None), "cast_shadow")):
                if owner is not None and hasattr(owner, prop):
                    setattr(owner, prop, False)
        ob = link(bpy.data.objects.new(name, li))
        ob.location = loc
        direction = Vector((0.3, 0, 1.6)) - Vector(loc)
        ob.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
        return ob

    # Key lateral (modela el volumen y da la sombra), luz cenital suave, tira para el
    # brillo vertical en esmalte y ceramica, y contraluz que recorta la silueta.
    area("Key", (-4.2, -5.0, 6.8), 5.0, 520, (1.0, 0.97, 0.93))
    area("Top", (-0.5, -1.0, 9.0), 6.0, 150, shadow=False)
    area("Strip", (4.8, -3.0, 3.0), (0.9, 5.0), 260, (0.94, 0.98, 1.0), shadow=False)
    area("Rim", (2.8, 5.5, 5.0), 3.0, 420, shadow=False)

    world = S.world or bpy.data.worlds.new("World")
    S.world = world
    try:
        world.use_nodes = True
    except Exception:
        pass
    nt = world.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputWorld")
    soft = nt.nodes.new("ShaderNodeBackground")
    soft.inputs["Strength"].default_value = 0.2
    hdri = os.path.join(bpy.utils.system_resource("DATAFILES"), "studiolights", "world", "studio.exr")
    if os.path.exists(hdri):
        env = nt.nodes.new("ShaderNodeTexEnvironment")
        env.image = bpy.data.images.load(hdri, check_existing=True)
        nt.links.new(env.outputs[0], soft.inputs["Color"])
    else:
        soft.inputs["Color"].default_value = (0.8, 0.8, 0.8, 1)
    white = nt.nodes.new("ShaderNodeBackground")
    white.inputs["Color"].default_value = (1, 1, 1, 1)
    white.inputs["Strength"].default_value = 1.0
    path = nt.nodes.new("ShaderNodeLightPath")
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(path.outputs["Is Transmission Ray"], mix.inputs[0])
    nt.links.new(soft.outputs[0], mix.inputs[1])
    nt.links.new(white.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs["Surface"])

    r = S.render
    try:
        r.engine = "CYCLES"
    except TypeError as err:
        print("engine:", err)
    S.cycles.device = "GPU"
    S.cycles.samples = 72
    S.cycles.use_adaptive_sampling = False
    S.cycles.use_denoising = True
    try:
        S.cycles.denoising_use_gpu = True  # OIDN en CPU tardaba ~45 s por frame
    except Exception as err:
        print("denoise:", err)
    S.cycles.max_bounces = 6
    r.use_persistent_data = True
    S.cycles.transmission_bounces = 8
    r.film_transparent = True
    r.resolution_x = r.resolution_y = 1000
    r.resolution_percentage = 100
    r.image_settings.file_format = "PNG"
    r.image_settings.color_mode = "RGBA"
    r.image_settings.compression = 40
    r.filepath = os.path.join(OUT_DIR, "f_")
    r.fps = 24
    S.frame_start, S.frame_end = 0, FRAME_END
    try:
        S.view_settings.view_transform = "AgX"
        S.view_settings.look = "AgX - Medium High Contrast"
    except TypeError as err:
        print("view:", err)
    S.frame_set(0)


print(build())

if bpy.app.background and not globals().get("RITUAL_NO_RENDER"):
    frames = [int(a) for a in ARGS[1:]]
    if frames:
        for f in frames:
            S.frame_set(f)
            S.render.filepath = os.path.join(OUT_DIR, f"f_{f:04d}.png")
            bpy.ops.render.render(write_still=True)
    else:
        bpy.ops.render.render(animation=True)
