const express = require('express');
const { 
    uploadNft, 
    catalogNft, 
    detailsNft, 
    editNft, 
    deleteNft, 
    likeNft, 
    ownNft, 
    latestNft, 
    mostWantedNft, 
    getNftUrl,
    commentNtf,
    giftNft
} = require('../controllers/nftControllers');

const router = express.Router()

router.route('/upload').post(uploadNft)
router.route('/catalog').get(catalogNft)

router.route('/catalog/most-wanted').get(mostWantedNft)
router.route('/catalog/most-wanted/:count').get(latestNft)

router.route('/catalog/:id').get(detailsNft)
router.route('/catalog/:id/edit').post(editNft)
router.route('/catalog/:id/delete').get(deleteNft)

router.route('/own/gift').post(giftNft)
router.route('/like/:id/:usernames').get(likeNft)
router.route('/own/:id/:usernames').post(ownNft)

router.route('/url').post(getNftUrl)

router.route('/:id/comments').post(commentNtf)

module.exports = router