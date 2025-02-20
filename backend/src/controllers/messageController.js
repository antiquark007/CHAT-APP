import User from "../models/userModel.js";
import Message from "../models/messageModel.js";


export const getUsersForSidebar = async (req, res) => {
  //every user but not our self
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password"); //currenly logged in user is not included

    return res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("getUsersForSidebar error", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    //find all the message where i am sender or other person is sender
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("getUserMessages error", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
    try {
        const {text,image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;
        
        let imageUrl ;
        if(image){
            //upload image to cloudinary
            const uploadedResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadedResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        });

        await newMessage.save();

        //this real time funct soket.io

        res.status(200).json(newMessage);

        
    } catch (error) {
        console.log("sendMessage error", error.message);
        return res.status(500).json({ message: "Server error" });
        
    }
}