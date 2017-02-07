three-js-edcai created by GitHub Classroom

##Ed Cai: THREE.js Project README - https://github.com/PennVR/three-js-edcai
 
### Techniques
1. Started off with the raycaster demo in the class. 
2. Added the WebVR files (WebVR.js, VRControls.js). I didn't know how to even start adding these files (never done web development before), so there was a lot flopping around helplessly in front of the computer. After a LONG time, somehow I figured out how to make VR work (albeit with some warnings in the console). 
3. Next, I stripped all the cubes from the demo, except for the floor. 
4. I took the Perlin Noise function used in this example: https://threejs.org/examples/webgl_geometry_terrain.html
5. I used the noise function from the above example and created an array of generated heights. Then I deformed my "THREE.PlaneGeometry" using the different heights to get a weird green terrain. 
6. There was no sense of depth in my new green terrain so I changed the material to include this grass texture: http://bgfons.com/upload/grass_texture220.jpg, which made it much better (but still pretty bad). 
7. My terrain looked a little weird because you could clearly see the edge. I added some fog to make it less obvious that you were standing in the middle of a green square. 
8. On to fireworks. I started by creating a rotating cube that floated up. When it reached a certain height then it reset to the original launch height. 
9. Next I added 30 invisible cubes to the explosion point with velocity 0. When the launching cube reached the explosion point, I randomly generated velocities for the 30 cubes to make a look like a firework. Not really spark-like, but I think it looks decent. 
10. Next I changed the starting points of the fireworks so that every time it reset it launched from a different location. 
11. Lastly, I changed the explosion point so that it was also random. All calculations on the firework are in the animate function. 

### Motion Sickness
The framerate was decent so I actually didn't feel much. I also didn't implement any movement, so that must have helped a lot. 

### Hardest Part
Learning how to debug graphics is something that I've never done before. Sometimes when I break my code everything just dissapears and it becomes super hard to debug stuff. This was especially true when I was testing my Perlin Noise floor.

### What Would I Do Differently?
When I was makeing the Perlin Noise floor, I should have left 1 cube in the center, just so that I could have a reference to orientation. Since I was working on a completely blank canvas, I was never sure what was wrong (or where I was looking). 

### What Should You Guys Do Differently?
I think it would be super helpful for next time if you guys create a template (with a floor, and maybe one cube) that already works for WebVR. Honestly, getting the VR setup was the hardest part for me, so giving a template would have let me do a lot more with my actual project. 
