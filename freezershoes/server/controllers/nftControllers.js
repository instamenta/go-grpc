const Nft = require('../models/NftModel')
const User = require('../models/UserModel')
const uploadNft = async (req, res) => {
    let {
        name,
        description,
        price,
        pic,
        userData,
    } = req.body;
    price = Number(price)
    const userInfo = userData
    const creator = userInfo._id
    let post = await Nft.create({ name, description, price, pic, creator })
    res.json({ post })
}

const catalogNft = async (req, res) => {
    const nftList = await Nft.find().sort({ _id: -1 })
    res.json(nftList)
}

const detailsNft = async (req, res) => {
    const nftId = req.params.id
    const data = await Nft.findById(nftId)
    res.json(data)
}
const editNft = async (req, res) => {
    const nftId = req.params.id
    const data = req.body
    await Nft.findByIdAndUpdate(nftId, {
        name: data.name,
        description: data.description,
        price: data.price,
        pic: data.pic
    })
    res.json()
}
const deleteNft = async (req, res) => {
    const nftId = req.params.id
    await Nft.findByIdAndDelete(nftId)
    res.json()
}

const likeNft = async (req, res) => {
    const user = req.params.usernames
    const nftId = req.params.id
    const nftData = await Nft.findOne({ _id: nftId }).lean()

    if (nftData.likes.includes(user)) {
        const response = await Nft.findOneAndUpdate({ _id: nftId }, { $pull: { likes: user } }).lean();
        await User.findOneAndUpdate({ username: user }, { $pull: { likedNft: nftId } }).lean();
        res.json(response)
    } else {
        const response = await Nft.findOneAndUpdate({ _id: nftId }, { $push: { likes: user } }).lean();
        await User.findOneAndUpdate({ username: user }, { $push: { likedNft: nftId } }).lean();
        res.json(response)
    }
}
const ownNft = async (req, res) => {
    const user = req.params.usernames
    const nftId = req.params.id
    const nftUrl = req.body.picUrl.toString()

    const userData = await User.findOne({ username: user }).lean()
    const nftData = await Nft.findOne({ _id: nftId }).lean()

    if (userData.ownedNft.includes(nftUrl) || nftData.owners.includes(user)) {
        await User.findOneAndUpdate({ username: user }, { $pull: { ownedNft: nftUrl } }).lean();
        const response = await Nft.findOneAndUpdate({ _id: nftId }, { $pull: { owners: user } }).lean();
        res.json(response)
    } else {
        await User.findOneAndUpdate({ username: user }, { $push: { ownedNft: nftUrl } }).lean();
        const response = await Nft.findOneAndUpdate({ _id: nftId }, { $push: { owners: user } }).lean();
        res.json(response)
    }
}
const latestNft = async (req, res) => {
    if (req.params) {
        const count = Number(req.params.count)
        const nftList = await Nft.find().sort({ price: -1 }).limit(count)
        res.json(nftList)
    }
}
const mostWantedNft = async (req, res) => {
    const nftList = await Nft.find().sort({ price: -1 })
    res.json(nftList)
}
const getNftUrl = async (req, res) => {
    const url = req.body.url
    const data = await Nft.findOne({ pic: url }).lean()
    if (data) {
        res.json(data)
    }
}

const commentNtf = async (req, res) => {
    const NFT = await Nft.findById(req.params.id);
    NFT.comments.push({
        text: req.body.text,
        author: req.body.author,
        pic: req.body.pic,
    });
    await NFT.save();
    res.json(NFT);
}
const giftNft = async (req, res) => {
    const currentUser = req.body.currentUser
    const user = req.body.user
    const url = req.body.url

console.log(user)

    let userData = await User.findOne({ username: user})
    let nftData = await Nft.findOne({ pic: url})
    let nftId = nftData._id
    if (userData.ownedNft.includes(url) && nftData.owners.includes(user)) {
        
        res.json({message: 'OWNED'})
    } else {
        await User.findOneAndUpdate({ username: user }, { $push: { ownedNft: url } }).lean();
        const response = await Nft.findOneAndUpdate({ _id: nftId }, { $push: { owners: user } }).lean();
        res.json(response)
    }

}
module.exports = { getNftUrl, uploadNft, catalogNft, detailsNft, editNft, deleteNft, likeNft, ownNft, latestNft, mostWantedNft, commentNtf, giftNft}