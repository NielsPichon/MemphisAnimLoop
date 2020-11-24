# MemphisAnimLoop

This is a fun design experiment. The principle is to use a topK to compute the closest points to any point and draw the lines from the point to its k closest neighbours. For aesthetic purposes there are 2 modes: closest and closest.

Recommended settins: `use_closest=true` with `num_vertices=200` or `use_closest=false` and `num_vertices=6`. The first will generate a memphis like pattern. The latter will create a moving polygon like shape. `refresh_connectivity = true` may be deactivated 
