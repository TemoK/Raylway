
/* GALLERY MANAGER */

var GalleryManager = {
    capturePhoto: function() {
        try {
            // Take picture using device camera and retrieve image as base64-encoded string
            navigator.camera.getPicture(this.onSuccess, this.onFail, {
                quality: 70,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.CAMERA
            });
        } catch (e) {
            this.onFail();
        }
    },
    getPhoto: function() {
        try {
            // Retrieve image file location from specified source
            navigator.camera.getPicture(this.onSuccess, this.onFail, {
                quality: 70,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY// OR SAVEDPHOTOALBUM 
            });
        } catch (e) {
            this.onFail();
        }
    },
    cleanup: function() {
        navigator.camera.cleanup(null, null);
    },
    onSuccess: function() {
    },
    onFail: function() {
    }
};

/* FILE TRANSFET */

var FTransfer = {
    fileURL: null,
    uploadURL: null,
    onProgress: function() {
    },
    onStart: function() {
    },
    onEnd: function() {
    },
    onAbort: function() {
    },
    uploadPhoto: function() {

        try {

            var options = new FileUploadOptions();
            var params = {};
            var pb = this.onProgress;
            var ft = new FileTransfer();

            options.fileKey = "file";
            options.fileName = this.fileURL.substr(this.fileURL.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.params = params;

            ft.onprogress = function(evt) {
                var percent = 0;
                if (evt.lengthComputable) {
                    percent = Math.floor(evt.loaded / evt.total * 100) + 1;
                    if (percent > 100)
                        percent = 100;
                    pb(percent);
                }
            };
            this.onStart();
            ft.upload(this.fileURL, encodeURI(this.uploadURL), this.onSuccess, this.onFail, options);
        } catch (e) {
            this.onFail();
        }
    },
    onSuccess: function() {
    },
    onFail: function() {
    }
};
