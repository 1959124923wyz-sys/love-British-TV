/* Longitude-aware rendering for schematic early-modern maritime connections.
   Geographic position points remain named historical references. Interpolated
   SVG vertices are NOT dated ship observations or a navigational track.
   Source data: data/drake-circumnavigation-1577-1580.json.
*/
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.AtlasVoyageGeometry=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const copiedWorldOffsets=Object.freeze([-360,0,360]);
  function unwrapCoordinates(coords){
    if(!Array.isArray(coords)||coords.length<2)throw new Error('At least two named maritime references are required');
    const result=[];
    for(const [i,p] of coords.entries()){
      if(!Array.isArray(p)||p.length!==2||!p.every(Number.isFinite)||Math.abs(p[0])>90||Math.abs(p[1])>180)
        throw new Error('Malformed [latitude,longitude] maritime reference at '+i);
      let longitude=p[1];
      if(result.length){
        const lastLongitude=result[result.length-1][1];
        while(longitude-lastLongitude>180)longitude-=360;
        while(longitude-lastLongitude< -180)longitude+=360;
      }
      result.push([p[0],longitude]);
    }
    return result;
  }
  function densifySchematicCoordinates(coords,maxStepDegrees=8){
    const line=unwrapCoordinates(coords),smooth=[line[0]];
    for(let i=1;i<line.length;i++){
      const from=line[i-1],to=line[i];
      const steps=Math.max(1,Math.ceil(Math.max(Math.abs(to[0]-from[0]),Math.abs(to[1]-from[1]))/maxStepDegrees));
      for(let j=1;j<=steps;j++){
        const part=j/steps;
        smooth.push([from[0]+(to[0]-from[0])*part,from[1]+(to[1]-from[1])*part]);
      }
    }
    return smooth;
  }
  function routeGeometryForWorldWrap(route){
    if(!route?.crosses_antimeridian)
      return route?.segments?.length?route.segments:route.coords;
    // One physical line in an unwrapped Pacific coordinate system, plus copies
    // at adjacent worlds. A world map has a seam; the same physical voyage can
    // reappear on both edges, but remains continuous if centered over Pacific.
    const line=densifySchematicCoordinates(route.coords);
    return copiedWorldOffsets.map(delta=>line.map(([lat,lon])=>[lat,lon+delta]));
  }
  return Object.freeze({unwrapCoordinates,densifySchematicCoordinates,routeGeometryForWorldWrap,copiedWorldOffsets});
});
