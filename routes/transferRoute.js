import {Router} from 'express'
import Account from '../models/transferModel.js'
import User from '../models/userModel.js'
import {auth} from '../middleware.js'


const router = Router();

router.post('/transfer',auth,async (req,res)=> {
    const { recvId,amount } = req.body;
    const userId = req.user;

    const session = await mongoose.startSession();
    session.startTransaction();


    const senderDetails =  await User.findById(userId);
    const receiverDetails = await User.findById(recvId);

    if(!senderDetails || receiverDetails){
        await session.abortTransaction();
        return res.status(404).json({
            success: true,
            message: "User not found"
        })
    }


    await Account.updateOne({userId: senderDetails.id},{$inc: {balance:-amount}}).session(session);
    await Account.updateOne({userId: receiverDetails.id},{$inc: {balance: amount}}).session(session);

    await session.commitTransaction();
    return res.status(200).json({
        success: true,
        message: "Transaction successful"
    })
})


router.get('/balance',auth,async (req,res) => {
    const id = req.user;

    const { balance } = await Account.findOne({userId:id});

    return res.status(200).json({
        success: true,
        message: "Money fetched successfully",
        amount: balance
    })
})

export default router;
