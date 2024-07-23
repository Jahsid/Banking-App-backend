const accountSchema = require("../schema/accountSchema")

const depositAmount = async (accountNo, amount) => {
  try {
    const data = await accountSchema.findOne({ accountNo: accountNo });

    if (!data) {
      return null;
    }

    const updatedData = await accountSchema.findOneAndUpdate(
      { accountNo: accountNo },
      { $inc: { balance: amount } },
      { new: true }
    );

    if (!updatedData) {
      return null;
    } else {
      return updatedData;
    }
  } catch (error) {
    console.error("Error updating balance:", error);
    throw error;
  }
};

const withdrawAmount = async (accountNo, amount) => {
  try {
    const data = await accountSchema.findOne({ accountNo: accountNo });

    if (!data) {
      return null;
    }

    if (data.balance < amount) {
      return null;
    }

    const updatedData = await accountSchema.findOneAndUpdate(
      { accountNo: accountNo },
      { $inc: { balance: -amount } },
      { new: true }
    );

    if (!updatedData) {
      return null;
    } else {
      return updatedData;
    }
  } catch (error) {
    console.error("Error updating balance:", error);
    throw error;
  }
};

const transferAmount = async (fromAcc, toAcc, amount) => {
  if (amount <= 0) {
    return { success: false, message: "Transfer amount must be greater than zero." };
  }

  try {
    const from = await accountSchema.findOne({ accountNo: fromAcc });
    const to = await accountSchema.findOne({ accountNo: toAcc });

    if (!from || !to) {
      throw new Error("One or both accounts not found.");
    }

    if (from.balance < amount) {
      throw new Error("Insufficient funds in the source account.");
    }

    // Update the 'from' account
    const fromUpdate = await accountSchema.findOneAndUpdate(
      { accountNo: fromAcc },
      { "$inc": { balance: -amount } },
      { new: true }
    );

    // Update the 'to' account
    const toUpdate = await accountSchema.findOneAndUpdate(
      { accountNo: toAcc },
      { "$inc": { balance: amount } },
      { new: true }
    );

    if (!fromUpdate || !toUpdate) {
      throw new Error("Failed to update accounts.");
    }

    return { success: true, message: "Transfer completed successfully." };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


module.exports = { depositAmount, withdrawAmount, transferAmount }