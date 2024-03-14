import { v4 as uuidv4 } from 'uuid';
import { Server, StableBTreeMap, ic } from 'azle';
import express from 'express';

/**
 * This type represents an NFT (Non-Fungible Token).
 */
type NFT = {
   id: string;
   name: string;
   description: string;
   imageUrl: string;
   creator: string;
   createdAt: Date;
};

// Initialize StableBTreeMap for NFTs
const nftStorage = StableBTreeMap<string, NFT>(0);

const app = express();
app.use(express.json());

// Endpoint to create a new NFT
app.post("/nfts", (req, res) => {
   const { name, description, imageUrl, creator } = req.body;
   const nft: NFT = {
      id: uuidv4(),
      name,
      description,
      imageUrl,
      creator,
      createdAt: new Date(),
   };
   nftStorage.insert(nft.id, nft);
   res.json(nft);
});

// Endpoint to get all NFTs
app.get("/nfts", (req, res) => {
   res.json(nftStorage.values());
});

// Endpoint to get a specific NFT by ID
app.get("/nfts/:id", (req, res) => {
   const nftId = req.params.id;
   const nftOpt = nftStorage.get(nftId);
   if ("None" in nftOpt) {
      res.status(404).send(`NFT with id ${nftId} not found`);
   } else {
      res.json(nftOpt.Some);
   }
});

// Endpoint to delete a specific NFT by ID
app.delete("/nfts/:id", (req, res) => {
   const nftId = req.params.id;
   const deletedNFT = nftStorage.remove(nftId);
   if ("None" in deletedNFT) {
      res.status(404).send(`NFT with id ${nftId} not found`);
   } else {
      res.json(deletedNFT.Some);
   }
});

// Start the server and export it as default
export default Server(() => app.listen());

