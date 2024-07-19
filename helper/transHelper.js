const accountSchema = require("../schema/accountSchema")

const depositAmount = async(accountNo, amount) => {
    accountSchema.findOne({accountNo:accountNo}),
        (err, data)=>{
            if(err || data == ""){
                return new Error("failed to deposit")
            } else{
                accountSchema.findOneAndUpdate({accountNo:accountNo},
                    {
                        "$set":{
                            balance: data.balance + amount
                        }
                    },
                    (err, data)=>{
                        if(err){
                            return new Error("failed to deposit")
                        } else{

                        }}
                )
        }}
}

module.exports = { depositAmount }