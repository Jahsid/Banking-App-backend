const accountSchema = require("../schema/accountSchema")

const depositAmount = async(accountNo, amount) => {
    const data = accountSchema.findOne({accountNo:accountNo})
    
    if (!data) {
        return null;
    }

    const update = await accountSchema.findOneAndUpdate({ accountNo: accountNo },
    {
        "$set": {
            balance: data.balance + amount
        }
    })

    if (!update) {
        return null;
    } else {
        return update;
    }
}

module.exports = { depositAmount }