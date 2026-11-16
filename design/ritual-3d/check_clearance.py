"""Comprueba que el kettle nunca atraviesa el dripper ni el filtro.

  blender -b --python design/ritual-3d/check_clearance.py

Construye la escena (sin renderizar) y, frame a frame, mide cuanto queda entre la
geometria del kettle y el volumen del dripper: un cilindro del radio del borde que
llega hasta el canto del filtro. Margen negativo = se atraviesan.
"""
import math
import os

import bpy

HERE = os.path.dirname(os.path.abspath(__file__))
scope = {"RITUAL_DIR": HERE, "RITUAL_NO_RENDER": True, "__name__": "ritual"}
exec(compile(open(os.path.join(HERE, "build_scene.py"), encoding="utf-8").read(), "build_scene.py", "exec"), scope)

RIM_RADIUS = 0.64  # borde del dripper (0.625) + holgura
RIM_TOP = 1.725  # canto superior del filtro de papel

scene = bpy.context.scene
kettle = [ob for ob in scene.objects if ob.name.startswith("Kettle") and ob.type in {"MESH", "CURVE"}]
rig = bpy.data.objects["DripperRig"]
worst = (math.inf, None)

for frame in range(50, 110):
    scene.frame_set(frame)
    depsgraph = bpy.context.evaluated_depsgraph_get()
    top = RIM_TOP + rig.evaluated_get(depsgraph).matrix_world.translation.z
    margin = math.inf
    for ob in kettle:
        evaluated = ob.evaluated_get(depsgraph)
        mesh = evaluated.to_mesh()
        world = evaluated.matrix_world
        for vertex in mesh.vertices:
            point = world @ vertex.co
            if math.hypot(point.x, point.y) < RIM_RADIUS:
                margin = min(margin, point.z - top)
        evaluated.to_mesh_clear()
    if margin < worst[0]:
        worst = (margin, frame)
    if margin < 0.05:
        print(f"frame {frame}: margen {margin:+.3f}")

print(f"CLEARANCE minimo {worst[0]:+.3f} en frame {worst[1]}")
print("CLEARANCE OK" if worst[0] > 0.02 else "CLEARANCE FAIL")
