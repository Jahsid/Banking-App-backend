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
  // Start a session for transaction
  const session = await accountSchema.startSession();
  session.startTransaction();

  try {
    const from = await accountSchema.findOne({ accountNo: fromAcc }).session(session);
    const to = await accountSchema.findOne({ accountNo: toAcc }).session(session);

    if (!from || !to) {
      throw new Error("One or both accounts not found.");
    }

    if (from.balance < amount) {
      throw new Error("Insufficient funds in the source account.");
    }

    const fromUpdate = await accountSchema.findOneAndUpdate(
      { accountNo: fromAcc },
      { "$inc": { balance: -amount } },
      { new: true, session }
    );

    if (!fromUpdate) {
      throw new Error("Failed to update source account.");
    }

    const toUpdate = await accountSchema.findOneAndUpdate(
      { accountNo: toAcc },
      { "$inc": { balance: amount } },
      { new: true, session }
    );

    if (!toUpdate) {
      throw new Error("Failed to update destination account.");
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Transfer completed successfully." };
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();

    return { success: false, message: error.message };
  }
};


module.exports = { depositAmount, withdrawAmount, transferAmount }