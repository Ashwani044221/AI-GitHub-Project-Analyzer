const projvalidate = (schema) => {
    return (req, res, next) => {

        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                errors: result.error.issues
            });
        }

        req.body = result.data;

        next();
    };
};

export default projvalidate;