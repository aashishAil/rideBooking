let empty = 'Should have some value';

exports.validate = variables => {
  return new Promise( (resolve , reject) => {
      let errors = {};
      for(let key in variables){
          if(!variables[key]){
              errors[key] = empty;
          }
      }
      if(!(Object.keys(errors).length === 0 && errors.constructor === Object)){
          resolve({
              errors : true,
              message : errors
          });
      }else {
          resolve({
             errors : false
          });
      }
    });
};