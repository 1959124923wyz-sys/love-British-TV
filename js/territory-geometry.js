/* Shared geographic reference hydration for dated historical territory states.
   Stored geography is immutable across decades unless new research explicitly
   supplies a different geometry. No historical boundaries are inferred here.
   Works in the browser and Node CI without a build step. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object' && module.exports) module.exports=api;
  else root.AtlasTerritoryGeometry=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const CANONICAL='data/territorial-footprints-1497-1549.geojson';
  function hydrateFootprints(base,period){
    if(base?.type!=='FeatureCollection'||!Array.isArray(base.features)||
       period?.type!=='FeatureCollection'||!Array.isArray(period.features))
      throw new Error('Territory GeoJSON collections are required');
    const byId=new Map();
    for(const f of base.features){
      if(typeof f.id!=='string'||byId.has(f.id)||!f.geometry?.coordinates)
        throw new Error('Invalid/duplicate canonical geographic feature');
      byId.set(f.id,f.geometry);
    }
    const ids=new Set();
    const features=period.features.map(f=>{
      if(typeof f.id!=='string'||ids.has(f.id))throw new Error('Duplicate or missing territorial feature ID');
      ids.add(f.id);
      const ref=f.properties?.geometry_ref;
      if(ref===undefined){
        if(!f.geometry?.coordinates)throw new Error('Territorial feature lacks geometry or reference: '+f.id);
        return f; // Newly researched geography may be published as an independent polygon.
      }
      if(f.geometry!==null || ref!==f.id ||
         period.metadata?.geometry_reference_file!==CANONICAL)
        throw new Error('Invalid canonical territory geometry reference: '+f.id);
      const geometry=byId.get(ref);
      if(!geometry)throw new Error('Unknown canonical territory geometry: '+ref);
      return {...f,geometry};
    });
    return {...period,features};
  }
  return Object.freeze({CANONICAL,hydrateFootprints});
});
