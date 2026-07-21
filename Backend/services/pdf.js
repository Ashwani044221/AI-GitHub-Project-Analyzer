import fs from "fs";
import pdf from "pdf-parse-new";

export const extractText = async(path)=>{

    const dataBuffer=fs.readFileSync(path);

    const data=await pdf(dataBuffer);

    return data.text;
}