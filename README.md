# mc 26.1+ piedar lab

https://thenml.github.io/mc-piedar/index.html

made because [modern minecraft's pie chart sucks](https://www.youtube.com/watch?v=9Qteg0--4iY)

the code is bad, but at least it's not vibecoded /hj

## findings

### better piedar

with the base 1.16.1 method diagonal cases can sometimes misread as polar opposites (a bottom-right can be read as top-left)

to fix this i recommend doing a full U turn instead of an L shape. as chunks no longer cache, this is basically as fast as 1.16.1

### how to get square distance from render distance

straight distances: rd+1

diagonal distances: rd - floor( (rd - 5) / 3 )