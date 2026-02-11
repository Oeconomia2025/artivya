import { useState, useRef } from "react";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Heart,
  Eye,
  Share2,
  Copy,
  Check,
  Settings,
  ImageIcon,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useAccount } from "wagmi";
import { WalletConnect } from "@/components/wallet-connect";

// Mock user NFTs
const mockUserNFTs = [
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
    id: 4,
    name: "Pixel Pioneer #42",
    collection: "Pixel Pioneers",
    image: "/oec-logo.png",
    price: 0.8,
    currency: "OEC",
    rarity: "rare",
    likes: 45,
    views: 890,
  },
  {
    id: 7,
    name: "Abstract Realm #12",
    collection: "Abstract Realms",
    image: "/oec-logo.png",
    price: 3.2,
    currency: "OEC",
    rarity: "epic",
    likes: 210,
    views: 4100,
  },
];

function getRarityColor(rarity: string) {
  switch (rarity) {
    case "legendary": return "text-yellow-400";
    case "epic": return "text-purple-400";
    case "rare": return "text-blue-400";
    case "uncommon": return "text-green-400";
    default: return "text-gray-400";
  }
}

export default function Profile() {
  const { address, isConnected } = useAccount();
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [bannerCollapsed, setBannerCollapsed] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setBannerImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const totalValue = mockUserNFTs.reduce((sum, nft) => sum + nft.price, 0);

  // Banner height = 1/3 viewport, frosted bar = 1/4 of banner height
  // When collapsed, only show the frosted bar portion
  const bannerFullHeight = "33.33vh";
  const frostedBarHeight = "calc(33.33vh / 4)";

  if (!isConnected) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
          <div className="text-center space-y-6 max-w-md">
            <div
              className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #11c4fe, #8a88f6)" }}
            >
              <ImageIcon className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Connect Your Wallet</h2>
            <p className="text-gray-400">
              Connect your wallet to view your profile and NFT collection.
            </p>
            <div className="max-w-xs mx-auto">
              <WalletConnect />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pb-8">
        {/* Banner + Profile Picture Section */}
        <div
          className="relative overflow-hidden transition-all duration-500 ease-in-out"
          style={{ height: bannerCollapsed ? frostedBarHeight : bannerFullHeight }}
        >
          {/* Banner Image - clickable to upload */}
          <div
            className="absolute inset-0 cursor-pointer group"
            style={{ backgroundColor: "#0a0a1a" }}
            onClick={(e) => {
              // Don't trigger upload if clicking on profile pic or toggle
              const target = e.target as HTMLElement;
              if (target.closest("[data-profile-pic]") || target.closest("[data-toggle]")) return;
              bannerInputRef.current?.click();
            }}
          >
            {bannerImage ? (
              <img
                src={bannerImage}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, rgba(17, 196, 254, 0.15), rgba(138, 136, 246, 0.15))" }}
              >
                {!bannerCollapsed && (
                  <div className="text-center text-gray-500">
                    <Camera className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Click to upload banner image</p>
                  </div>
                )}
              </div>
            )}
            {/* Hover overlay for upload - only when expanded */}
            {!bannerCollapsed && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <div className="text-center text-white">
                  <Camera className="w-8 h-8 mx-auto mb-1" />
                  <p className="text-sm">Change banner</p>
                </div>
              </div>
            )}
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerUpload}
            />
          </div>

          {/* Wallet address - top right corner of banner */}
          {!bannerCollapsed && (
            <button
              onClick={copyAddress}
              className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono text-gray-300 hover:text-white transition-colors"
              style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
            >
              <span>{address}</span>
              {copied ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          )}

          {/* Profile Picture - absolutely positioned, 90% of banner height, centered vertically */}
          <div
            className="absolute left-5 z-20 flex items-center transition-all duration-500 ease-in-out"
            style={{
              top: bannerCollapsed ? "50%" : "50%",
              transform: "translateY(-50%)",
              height: bannerCollapsed ? frostedBarHeight : bannerFullHeight,
            }}
            data-profile-pic
          >
            <div
              className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-xl shadow-black/50 transition-all duration-500 ease-in-out"
              style={{
                width: bannerCollapsed ? "calc(33.33vh / 4 - 16px)" : "calc(33.33vh * 0.9)",
                height: bannerCollapsed ? "calc(33.33vh / 4 - 16px)" : "calc(33.33vh * 0.9)",
                minWidth: bannerCollapsed ? "48px" : "80px",
                minHeight: bannerCollapsed ? "48px" : "80px",
                border: "3px solid rgba(255,255,255,0.15)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                profileInputRef.current?.click();
              }}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #11c4fe, #8a88f6)" }}
                >
                  <Camera className="w-10 h-10 text-white opacity-70" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileUpload}
              />
            </div>
          </div>

          {/* Frosted glass stats bar - along the bottom of banner */}
          <div
            className="absolute bottom-0 left-0 right-0 z-10 flex items-center"
            style={{
              height: frostedBarHeight,
              background: "rgba(255, 255, 255, 0.10)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              paddingLeft: bannerCollapsed ? "calc(33.33vh / 4 - 16px + 60px)" : "calc(33.33vh * 0.9 + 60px)",
              transition: "padding-left 0.5s ease-in-out",
            }}
          >
            {/* Stats */}
            <div className="flex items-center gap-6 md:gap-8 flex-1 overflow-x-auto scrollbar-hide px-2">
              <div className="text-center flex-shrink-0">
                <p className="text-sm md:text-base font-bold text-white">{mockUserNFTs.length}</p>
                <p className="text-[10px] md:text-xs text-gray-300/70">NFTs</p>
              </div>
              <div className="text-center flex-shrink-0">
                <p className="text-sm md:text-base font-bold text-white">0.8 OEC</p>
                <p className="text-[10px] md:text-xs text-gray-300/70">Floor Price</p>
              </div>
              <div className="text-center flex-shrink-0">
                <p className="text-sm md:text-base font-bold text-white">1.2 OEC</p>
                <p className="text-[10px] md:text-xs text-gray-300/70">Top Offer</p>
              </div>
              <div className="text-center flex-shrink-0">
                <p className="text-sm md:text-base font-bold" style={{ color: "#11c4fe" }}>
                  {totalValue.toFixed(1)} OEC
                </p>
                <p className="text-[10px] md:text-xs text-gray-300/70">Total Volume</p>
              </div>
            </div>

            {/* Wallet address in frosted bar when collapsed */}
            {bannerCollapsed && (
              <button
                onClick={copyAddress}
                className="flex-shrink-0 flex items-center gap-1 px-2 py-1 mr-2 rounded text-[10px] font-mono text-gray-300 hover:text-white transition-colors"
              >
                <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                {copied ? (
                  <Check className="w-2.5 h-2.5 text-green-400" />
                ) : (
                  <Copy className="w-2.5 h-2.5" />
                )}
              </button>
            )}
          </div>

          {/* Toggle button - bottom right corner of banner */}
          <button
            data-toggle
            onClick={(e) => {
              e.stopPropagation();
              setBannerCollapsed(!bannerCollapsed);
            }}
            className="absolute bottom-2 right-3 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
            title={bannerCollapsed ? "Expand banner" : "Collapse banner"}
          >
            {bannerCollapsed ? (
              <ChevronDown className="w-4 h-4 text-white" />
            ) : (
              <ChevronUp className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        {/* Edit Profile button */}
        <div className="flex justify-end px-6 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-600 hover:bg-white/5"
          >
            <Settings className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Divider */}
        <div className="mx-6 mt-4 mb-6 border-t" style={{ borderColor: "rgba(138, 136, 246, 0.3)" }} />

        {/* NFT Collection */}
        <div className="px-6">
          <h2 className="text-lg font-semibold text-white mb-4">My NFTs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mockUserNFTs.map((nft) => (
              <Card key={nft.id} className="crypto-card border-0 overflow-hidden group cursor-pointer">
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-16 h-16 object-cover group-hover:scale-125 transition-transform duration-500 ease-in-out"
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-2 space-x-2">
                    <Button size="sm" variant="outline" className="border-white/40 bg-black/50 hover:bg-white/20">
                      <Heart className="w-4 h-4 text-white" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/40 bg-black/50 hover:bg-white/20">
                      <Share2 className="w-4 h-4 text-white" />
                    </Button>
                  </div>

                  <Badge className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)} bg-black/70`}>
                    {nft.rarity}
                  </Badge>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-white truncate">{nft.name}</h3>
                  <p className="text-sm text-gray-400 truncate">{nft.collection}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-bold" style={{ color: "#11c4fe" }}>{nft.price} {nft.currency}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        {nft.likes}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {nft.views}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
