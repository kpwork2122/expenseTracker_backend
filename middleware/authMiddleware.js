import jwt from "jsonwebtoken";

const JWT_SECRET = "your_secret_key";

const protect = (req,res, next) => {
    try{    
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message: "No token, Access denied!"});
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded
        next()

    }catch(err){
        res.status(401).json({message:"Invalid or expired token"})
    }
}

export default protect;