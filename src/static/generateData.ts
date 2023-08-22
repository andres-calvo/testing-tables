import {v4 as uuidv4} from "uuid"
export const generateColumns=(cols:number)=>{
    return Array.from({length:cols},(_,x)=>`col-${x}`).concat("id")
}
const generateRandomString=()=>{
   return (Math.random() + 1).toString(36).substring(2);
}
export const generateRows=(columns:Array<string>,rows)=>{
    return Array.from({length:rows},(_,x)=>{
        const map = new Map<string,string>()
        map.set("id",uuidv4())
        columns.forEach(col=>{
            map.set(col,generateRandomString())
        })
        return Object.fromEntries(map)
    })

}


