const Uuid = require('uuid');
const fs = require('fs');


////////////////////////////////////////////////////////////


function UploadPlugin(objServer, objOptions, fnDone) {

  function uploadSingleFile(objFile, objUploadOption) {
    if (!objFile) {
      throw new Error('Missing file');
    }
    
    const _objOptions = Object.assign({}, objOptions, objUploadOption);
    
    const strOriginalName = objFile.hapi.filename;
    const strNewFilename = `${Uuid.v1()}.${strOriginalName.split('.').pop()}`;
    const strPath = `${_objOptions.destination}${strNewFilename}`;
    const fileStream = fs.createWriteStream(strPath);


    return new Promise((fnResolve, fnReject) => {
      objFile.on('error', function (err) {
        fnReject(err);
      });

      
      objFile.pipe(fileStream);


      objFile.on('end', function (err) {
        const objFileMeta = {
          fieldName: objFile.hapi.name,
          originalName: strOriginalName,
          filename: strNewFilename,
          mimetype: objFile.hapi.headers['content-type'],
          destination: `${_objOptions.destination}`,
          path: strPath,
          size: fs.statSync(strPath).size,
        }

        fnResolve(objFileMeta);
      })
    });
  }


  objServer.method('uploadSingleFile', uploadSingleFile);
  fnDone();
}


////////////////////////////////////////////////////////////


module.exports = UploadPlugin;

module.exports.attributes = {
  name: 'SingleUploadMethod'
};