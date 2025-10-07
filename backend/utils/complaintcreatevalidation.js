const zod=require("zod");
const complaintcreateSchema=zod.object({
    title:zod.string().min(5),
    description:zod.string().min(10),
    dept:zod.enum(["roads","water","waste","electricity","other"]),
    location:zod.object({
        city:zod.string().min(2),
        lat : zod.string().optional(),
        lng : zod.string().optional()    
    }),
    photo : zod.string().optional()
});
module.exports={complaintcreateSchema};