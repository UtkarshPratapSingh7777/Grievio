const zod=require("zod");
const citizenregisterSchema=zod.object({
    name:zod.string().min(3),
    email:zod.string().email(),
    password:zod.string().min(6),
    
});
const adminregisterSchema=zod.object({  
    name:zod.string().min(3),
    email:zod.string().email().includes("@admin.com"),
    password:zod.string().min(6),
    dept:zod.enum(["roads","water","waste","electricity","other"]),
    location:zod.object({
        city:zod.string().min(2)
    })
}
);
const staffregisterSchema=zod.object({  
    name:zod.string().min(3),
    email:zod.string().email().includes("@staff.com"),
    password:zod.string().min(6),
    dept:zod.enum(["roads","water","waste","electricity","other"]),
    location:zod.object({
        city:zod.string().min(2)
    })
}
);
const loginschema=zod.object({
    email:zod.string().email(),
    password:zod.string().min(6)
})
module.exports={citizenregisterSchema,adminregisterSchema,staffregisterSchema};
