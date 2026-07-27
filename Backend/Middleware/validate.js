const validate=(schema) => {

    return (req,res,next) => {
        console.log("Validating...");

        const result=schema.safeParse(req.body); // this req.body is contains original data

        if(!result.success){
                console.log("Validation Failed");
                console.log(result.error.issues);
            return res.status(400).json({
                success:false,
                errors:result.error.issues
            });
        }

        console.log("Validation Passed");
        req.body =result.data; // this is used for cintaing valid data after validation from safeparse

        next();
    };
};

export default validate;