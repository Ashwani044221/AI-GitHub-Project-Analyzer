import multer from "multer";
import path from "path";

const storage=multer.diskStorage({

    destination(req,file,cb){
        cb(null,"uploads/");
    },

    filename(req,file,cb){
        const uniqueName =
        Date.now() + path.extname(file.originalname); // path prevent name conflict and return after dot eg .pdf 

        cb(null,uniqueName);
    }
});

const fileFilter=(req,file,cb)=>{

    if(file.mimetype==="application/pdf"){

        cb(null,true);

    }else{

        cb(new Error("Only PDF allowed"),false);
    }

}

const  upload=multer({
    storage,
    fileFilter
});

export default upload;