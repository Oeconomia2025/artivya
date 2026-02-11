import { useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  TrendingUp,
  Users,
  ImageIcon,
  ChevronRight,
  Heart,
  Eye,
  Sparkles,
} from "lucide-react";

// Mock collections data
const mockCollections = [
  {
    name: "Oeconomia Genesis",
    image: "/oec-logo.png",
    banner: null,
    items: 3,
    owners: 2,
    floorPrice: 2.5,
    totalVolume: 7.3,
    change24h: 12.5,
    verified: true,
    description: "The founding collection of the Oeconomia ecosystem.",
  },
  {
    name: "Crypto Creatures",
    image: "/oec-logo.png",
    banner: null,
    items: 3,
    owners: 3,
    floorPrice: 1.2,
    totalVolume: 4.5,
    change24h: -3.2,
    verified: true,
    description: "Mythical creatures powered by blockchain technology.",
  },
  {
    name: "DeFi Bots",
    image: "/oec-logo.png",
    banner: null,
    items: 3,
    owners: 2,
    floorPrice: 0.9,
    totalVolume: 3.1,
    change24h: 8.7,
    verified: false,
    description: "Automated trading bots as collectible NFTs.",
  },
  {
    name: "Magic Crystals",
    image: "/oec-logo.png",
    banner: null,
    items: 4,
    owners: 3,
    floorPrice: 1.5,
    totalVolume: 6.8,
    change24h: 5.1,
    verified: true,
    description: "Enchanted crystals with unique on-chain properties.",
  },
  {
    name: "Pool Guardians",
    image: "/oec-logo.png",
    banner: null,
    items: 2,
    owners: 2,
    floorPrice: 1.1,
    totalVolume: 2.4,
    change24h: -1.8,
    verified: false,
    description: "Guardians that protect liquidity pools across the ecosystem.",
  },
  {
    name: "DAO Emblems",
    image: "/oec-logo.png",
    banner: null,
    items: 2,
    owners: 2,
    floorPrice: 2.1,
    totalVolume: 4.2,
    change24h: 15.3,
    verified: true,
    description: "Official governance emblems for DAO participation.",
  },
  {
    name: "Sound Waves",
    image: "/oec-logo.png",
    banner: null,
    items: 4,
    owners: 3,
    floorPrice: 0.6,
    totalVolume: 2.8,
    change24h: 2.4,
    verified: false,
    description: "Audio-visual NFTs representing sound frequencies.",
  },
  {
    name: "Legendary Weapons",
    image: "/oec-logo.png",
    banner: null,
    items: 3,
    owners: 2,
    floorPrice: 3.0,
    totalVolume: 9.5,
    change24h: 22.1,
    verified: true,
    description: "Rare weapons forged in the digital realm.",
  },
  {
    name: "Cyber Pets",
    image: "/oec-logo.png",
    banner: null,
    items: 2,
    owners: 2,
    floorPrice: 0.4,
    totalVolume: 1.2,
    change24h: -5.6,
    verified: false,
    description: "Adorable cybernetic companions for the metaverse.",
  },
  {
    name: "Gaming Nostalgia",
    image: "/oec-logo.png",
    banner: null,
    items: 2,
    owners: 1,
    floorPrice: 0.7,
    totalVolume: 1.8,
    change24h: 0.0,
    verified: false,
    description: "Retro gaming moments immortalized on-chain.",
  },
  {
    name: "Retro Punks",
    image: "/oec-logo.png",
    banner: null,
    items: 1,
    owners: 1,
    floorPrice: 1.3,
    totalVolume: 1.3,
    change24h: 4.2,
    verified: false,
    description: "Pixel art punks with a retro aesthetic.",
  },
  {
    name: "Speed Demons",
    image: "/oec-logo.png",
    banner: null,
    items: 1,
    owners: 1,
    floorPrice: 0.5,
    totalVolume: 0.5,
    change24h: -2.1,
    verified: false,
    description: "High-speed vehicles from the digital racing world.",
  },
];

// Featured NFTs
const featuredNFTs = [
  {
    id: 1,
    name: "Oeconomia Genesis #001",
    collection: "Oeconomia Genesis",
    image: "/oec-logo.png",
    price: 2.5,
    currency: "OEC",
    rarity: "legendary",
    likes: 156,
    views: 2340,
  },
  {
    id: 8,
    name: "Excalibur Digital",
    collection: "Legendary Weapons",
    image: "/oec-logo.png",
    price: 3.0,
    currency: "OEC",
    rarity: "legendary",
    likes: 312,
    views: 5100,
  },
  {
    id: 6,
    name: "DAO Crown #01",
    collection: "DAO Emblems",
    image: "/oec-logo.png",
    price: 2.1,
    currency: "OEC",
    rarity: "epic",
    likes: 189,
    views: 3200,
  },
  {
    id: 4,
    name: "Amethyst Shard",
    collection: "Magic Crystals",
    image: "/oec-logo.png",
    price: 1.5,
    currency: "OEC",
    rarity: "rare",
    likes: 97,
    views: 1800,
  },
];

function getRarityColor(rarity: string) {
  switch (rarity) {
    case "legendary": return "text-yellow-400";
    case "epic": return "text-purple-400";
    case "rare": return "text-blue-400";
    default: return "text-gray-400";
  }
}

export default function Collections() {
  const [searchTerm, setSearchTerm] = useState("");
  const [, navigate] = useLocation();

  const filteredCollections = mockCollections
    .filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.totalVolume - a.totalVolume);

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-0px)]">
        {/* Sticky top section - title + search */}
        <div className="flex-shrink-0 px-8 pt-8 pb-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Collections</h1>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search collections..."
                className="pl-10 bg-black/30 border-white/20"
              />
            </div>
          </div>
        </div>

        {/* Sticky sub-headers row */}
        <div className="flex-shrink-0 px-8">
          <div className="max-w-7xl mx-auto flex gap-6">
            {/* Featured header */}
            <div className="hidden lg:flex w-64 flex-shrink-0 items-center gap-2 pb-2">
              <Sparkles className="w-4 h-4" style={{ color: "#11c4fe" }} />
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Featured</h2>
            </div>
            {/* Column headers */}
            <div className="flex-1 min-w-0">
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">
                <div className="col-span-4">Collection</div>
                <div className="col-span-2 text-right">Floor Price</div>
                <div className="col-span-2 text-right">Volume</div>
                <div className="col-span-1 text-right">24h</div>
                <div className="col-span-1 text-right">Items</div>
                <div className="col-span-1 text-right">Owners</div>
                <div className="col-span-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Single shared scrollable area for both columns */}
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-8 pb-8">
          <div className="max-w-7xl mx-auto flex gap-6">

            {/* Featured NFTs - Left Column */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="space-y-3">
                {featuredNFTs.map((nft) => (
                  <Card
                    key={nft.id}
                    className="crypto-card border-0 overflow-hidden cursor-pointer group hover:bg-white/5 transition-colors"
                    onClick={() => navigate(`/?collection=${encodeURIComponent(nft.collection)}`)}
                  >
                    <div className="relative">
                      <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                        <img
                          src={nft.image}
                          alt={nft.name}
                          className="w-14 h-14 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <Badge
                        className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)} bg-black/70 border-0 text-[10px]`}
                      >
                        {nft.rarity}
                      </Badge>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-white truncate">{nft.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{nft.collection}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-bold" style={{ color: "#11c4fe" }}>
                          {nft.price} {nft.currency}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                          <span className="flex items-center">
                            <Heart className="w-2.5 h-2.5 mr-0.5" />
                            {nft.likes}
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-2.5 h-2.5 mr-0.5" />
                            {nft.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Collections List - Right Side */}
            <div className="flex-1 min-w-0">
              <div className="space-y-2">
                {filteredCollections.map((collection, index) => (
                  <Card
                    key={collection.name}
                    className="crypto-card border-0 overflow-hidden cursor-pointer group hover:bg-white/5 transition-colors"
                    onClick={() => navigate(`/?collection=${encodeURIComponent(collection.name)}`)}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center p-4">
                      {/* Collection Info */}
                      <div className="col-span-12 md:col-span-4 flex items-center gap-4">
                        <span className="text-sm text-gray-500 w-6 text-right flex-shrink-0">
                          {index + 1}
                        </span>
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <img
                            src={collection.image}
                            alt={collection.name}
                            className="w-8 h-8 object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white truncate">
                              {collection.name}
                            </h3>
                            {collection.verified && (
                              <Badge
                                className="text-[10px] px-1.5 py-0 border-0"
                                style={{ background: "linear-gradient(135deg, #11c4fe, #8a88f6)" }}
                              >
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {collection.description}
                          </p>
                        </div>
                      </div>

                      {/* Floor Price */}
                      <div className="col-span-4 md:col-span-2 text-right">
                        <p className="font-semibold text-white">
                          {collection.floorPrice} OEC
                        </p>
                        <p className="text-xs text-gray-500 md:hidden">Floor</p>
                      </div>

                      {/* Volume */}
                      <div className="col-span-4 md:col-span-2 text-right">
                        <p className="font-semibold" style={{ color: "#11c4fe" }}>
                          {collection.totalVolume} OEC
                        </p>
                        <p className="text-xs text-gray-500 md:hidden">Volume</p>
                      </div>

                      {/* 24h Change */}
                      <div className="col-span-4 md:col-span-1 text-right">
                        <p
                          className={`text-sm font-medium ${
                            collection.change24h > 0
                              ? "text-green-400"
                              : collection.change24h < 0
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                        >
                          {collection.change24h > 0 ? "+" : ""}
                          {collection.change24h}%
                        </p>
                      </div>

                      {/* Items */}
                      <div className="hidden md:block col-span-1 text-right">
                        <div className="flex items-center justify-end gap-1 text-gray-400">
                          <ImageIcon className="w-3 h-3" />
                          <span className="text-sm">{collection.items}</span>
                        </div>
                      </div>

                      {/* Owners */}
                      <div className="hidden md:block col-span-1 text-right">
                        <div className="flex items-center justify-end gap-1 text-gray-400">
                          <Users className="w-3 h-3" />
                          <span className="text-sm">{collection.owners}</span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="hidden md:flex col-span-1 justify-end">
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredCollections.length === 0 && (
                <div className="text-center py-16">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">No collections found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
