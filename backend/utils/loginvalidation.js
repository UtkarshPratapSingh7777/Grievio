const zod=require("zod");

const loginschema=zod.object({
    email:zod.string().email(),
    password:zod.string().min(6)
})
module.exports={loginschema};
