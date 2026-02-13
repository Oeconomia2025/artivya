import { useState, useRef, useEffect } from "react";
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
  Wallet,
  X,
} from "lucide-react";
import { SiX, SiDiscord, SiTelegram, SiGithub, SiYoutube, SiInstagram, SiLinkedin } from "react-icons/si";
import { useAccount } from "wagmi";
import { WalletConnect } from "@/components/wallet-connect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SOCIAL_PLATFORMS = [
  { key: "twitter", label: "Twitter / X", icon: SiX, placeholder: "https://x.com/username" },
  { key: "discord", label: "Discord", icon: SiDiscord, placeholder: "https://discord.gg/invite" },
  { key: "telegram", label: "Telegram", icon: SiTelegram, placeholder: "https://t.me/username" },
  { key: "github", label: "GitHub", icon: SiGithub, placeholder: "https://github.com/username" },
  { key: "youtube", label: "YouTube", icon: SiYoutube, placeholder: "https://youtube.com/@channel" },
  { key: "instagram", label: "Instagram", icon: SiInstagram, placeholder: "https://instagram.com/username" },
  { key: "linkedin", label: "LinkedIn", icon: SiLinkedin, placeholder: "https://linkedin.com/in/username" },
] as const;

type SocialLinks = Record<string, string>;

interface ProfileData {
  displayName: string;
  nameType: "username" | "wallet";
  socials: SocialLinks;
}

function loadProfileData(): ProfileData {
  try {
    const saved = localStorage.getItem("artivya-profile-data");
    if (saved) return JSON.parse(saved);
  } catch {}
  return { displayName: "", nameType: "wallet", socials: {} };
}

function saveProfileData(data: ProfileData) {
  localStorage.setItem("artivya-profile-data", JSON.stringify(data));
}

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
  {
    id: 81,
    name: "Phantom Circuit",
    collection: "Neon Streets",
    image: "/oec-logo.png",
    price: 3.2,
    currency: "OEC",
    rarity: "epic",
    likes: 234,
    views: 3890,
  },
  {
    id: 82,
    name: "Kraken of the Abyss",
    collection: "Cosmic Creatures",
    image: "/oec-logo.png",
    price: 7.8,
    currency: "OEC",
    rarity: "legendary",
    likes: 412,
    views: 6720,
  },
  {
    id: 83,
    name: "Solstice Meditation",
    collection: "Zen Gardens",
    image: "/oec-logo.png",
    price: 1.4,
    currency: "OEC",
    rarity: "rare",
    likes: 178,
    views: 2450,
  },
  {
    id: 84,
    name: "Titan Warframe MK-IV",
    collection: "Battle Mechs",
    image: "/oec-logo.png",
    price: 6.5,
    currency: "OEC",
    rarity: "legendary",
    likes: 389,
    views: 5430,
  },
  {
    id: 85,
    name: "Resonance Protocol",
    collection: "Sound Waves",
    image: "/oec-logo.png",
    price: 2.1,
    currency: "OEC",
    rarity: "epic",
    likes: 267,
    views: 3120,
  },
  {
    id: 86,
    name: "Governance Sigil #007",
    collection: "DAO Emblems",
    image: "/oec-logo.png",
    price: 4.0,
    currency: "OEC",
    rarity: "epic",
    likes: 310,
    views: 4560,
  },
  {
    id: 87,
    name: "Infinity Shard",
    collection: "Celestial Stones",
    image: "/oec-logo.png",
    price: 9.9,
    currency: "OEC",
    rarity: "mythic",
    likes: 623,
    views: 9870,
  },
  {
    id: 88,
    name: "Pixel Paladin",
    collection: "Arcade Legends",
    image: "/oec-logo.png",
    price: 1.6,
    currency: "OEC",
    rarity: "rare",
    likes: 198,
    views: 2780,
  },
  {
    id: 89,
    name: "Void Walker",
    collection: "Dimensional Beings",
    image: "/oec-logo.png",
    price: 5.5,
    currency: "OEC",
    rarity: "legendary",
    likes: 445,
    views: 7230,
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
  const [bannerImage, setBannerImage] = useState<string | null>(() => localStorage.getItem("artivya-banner-image"));
  const [profileImage, setProfileImage] = useState<string | null>(() => localStorage.getItem("artivya-profile-image"));
  const [copied, setCopied] = useState(false);
  const [bannerCollapsed, setBannerCollapsed] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(loadProfileData);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editNameType, setEditNameType] = useState<"username" | "wallet">("wallet");
  const [editSocials, setEditSocials] = useState<SocialLinks>({});
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setBannerImage(dataUrl);
        localStorage.setItem("artivya-banner-image", dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setProfileImage(dataUrl);
        localStorage.setItem("artivya-profile-image", dataUrl);
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

  const openEditModal = () => {
    setEditName(profileData.displayName);
    setEditNameType(profileData.nameType);
    setEditSocials({ ...profileData.socials });
    setEditOpen(true);
  };

  const saveProfile = () => {
    const updated: ProfileData = {
      displayName: editName.trim(),
      nameType: editNameType,
      socials: Object.fromEntries(
        Object.entries(editSocials).filter(([, v]) => v.trim() !== "")
      ),
    };
    setProfileData(updated);
    saveProfileData(updated);
    setEditOpen(false);
  };

  const getDisplayName = () => {
    if (profileData.nameType === "username" && profileData.displayName) {
      return profileData.displayName;
    }
    if (address) return address;
    return "";
  };

  const getShortDisplayName = () => {
    if (profileData.nameType === "username" && profileData.displayName) {
      return profileData.displayName;
    }
    if (address) return `${address.slice(0, 6)}...${address.slice(-4)}`;
    return "";
  };

  const activeSocials = SOCIAL_PLATFORMS.filter(
    (p) => profileData.socials[p.key]?.trim()
  );

  const totalValue = mockUserNFTs.reduce((sum, nft) => sum + nft.price, 0);
  const lastScrollY = useRef(0);
  const bannerRef = useRef<HTMLDivElement>(null);
  const justCollapsed = useRef(false);

  // Auto-collapse banner on scroll down, expand on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > 0 && !bannerCollapsed) {
        justCollapsed.current = true;
        setBannerCollapsed(true);
        // Snap to top so cards start right below sticky elements
        requestAnimationFrame(() => {
          window.scrollTo(0, 0);
        });
        // Allow re-expand again after the scrollTo dust settles
        setTimeout(() => { justCollapsed.current = false; }, 500);
      } else if (currentY <= 0 && bannerCollapsed && !justCollapsed.current) {
        setBannerCollapsed(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [bannerCollapsed]);

  // Banner height = 45% viewport, frosted bar = 1/3 of banner height
  // When collapsed, only show the frosted bar portion
  const bannerFullHeight = "40vh";
  const frostedBarHeight = "calc(40vh / 3.5)";

  return (
    <Layout>
      <div className="pb-8">
        {/* Banner + Profile Picture Section */}
        <div
          className="relative overflow-hidden transition-all duration-500 ease-in-out sticky top-0 z-20"
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

          {/* Top right corner of banner - Display name / wallet address or Connect button */}
          {!bannerCollapsed && (
            isConnected && address ? (
              <button
                onClick={copyAddress}
                className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-1 rounded-md text-xs text-gray-300 hover:text-white transition-colors"
                style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
              >
                <span className={profileData.nameType === "username" && profileData.displayName ? "font-semibold" : "font-mono"}>{getDisplayName()}</span>
                {copied ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            ) : (
              <div className="absolute top-3 right-3 z-20 w-40">
                <WalletConnect />
              </div>
            )
          )}

          {/* Profile Picture - absolutely positioned, 90% of banner height, centered vertically */}
          <div
            className="absolute left-5 z-20 flex items-center transition-all duration-500 ease-in-out"
            style={{
              top: "50%",
              transform: "translateY(-50%)",
              height: bannerCollapsed ? frostedBarHeight : bannerFullHeight,
            }}
            data-profile-pic
          >
            <div
              className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-xl shadow-black/50 transition-all duration-500 ease-in-out"
              style={{
                width: bannerCollapsed ? "calc(40vh / 4 - 16px)" : "calc(40vh * 0.9)",
                height: bannerCollapsed ? "calc(40vh / 4 - 16px)" : "calc(40vh * 0.9)",
                minWidth: bannerCollapsed ? "48px" : "80px",
                minHeight: bannerCollapsed ? "48px" : "80px",
                border: "3px solid rgba(255,255,255,0.15)",
                background: "rgba(255, 255, 255, 0.10)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
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
              paddingLeft: bannerCollapsed ? "calc(40vh / 4 - 16px + 60px)" : "calc(40vh * 0.9 + 60px)",
              transition: "padding-left 0.5s ease-in-out",
            }}
          >
            {/* Stats */}
            <div className="flex items-center gap-6 md:gap-8 flex-1 overflow-x-auto scrollbar-hide px-2">
              {isConnected ? (
                <>
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
                </>
              ) : (
                <div className="flex items-center gap-2 text-gray-400">
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm">Connect wallet to view stats</span>
                </div>
              )}
            </div>

            {/* Display name / wallet address in frosted bar when collapsed */}
            {bannerCollapsed && isConnected && address && (
              <button
                onClick={copyAddress}
                className="flex-shrink-0 flex items-center gap-1 px-2 py-1 mr-2 rounded text-[10px] text-gray-300 hover:text-white transition-colors"
              >
                <span className={profileData.nameType === "username" && profileData.displayName ? "font-semibold" : "font-mono"}>{getShortDisplayName()}</span>
                {copied ? (
                  <Check className="w-2.5 h-2.5 text-green-400" />
                ) : (
                  <Copy className="w-2.5 h-2.5" />
                )}
              </button>
            )}

            {/* Connect wallet button in frosted bar when collapsed and not connected */}
            {bannerCollapsed && !isConnected && (
              <div className="flex-shrink-0 mr-2 w-32">
                <WalletConnect />
              </div>
            )}

            {/* Social icons + Edit Profile button - right end of frosted bar */}
            <div className="flex-shrink-0 flex items-center mr-3">
              <div className="flex items-center gap-3 mr-12">
                {activeSocials.map((platform) => (
                  <a
                    key={platform.key}
                    href={profileData.socials[platform.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    title={platform.label}
                  >
                    <platform.icon className="w-7 h-7" />
                  </a>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs"
                onClick={openEditModal}
              >
                <Settings className="w-3.5 h-3.5 mr-1.5" />
                Edit Profile
              </Button>
            </div>
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

        {/* Divider */}
        <div className="mx-6 mt-4 mb-6 border-t" style={{ borderColor: "rgba(138, 136, 246, 0.3)" }} />

        {/* NFT Collection */}
        <div className="px-6">
          <h2
            className="text-lg font-semibold text-white mb-[3.5rem] sticky z-10 py-3 -mx-6 px-6"
            style={{
              top: frostedBarHeight,
              backgroundColor: "var(--background, #030712)",
            }}
          >My NFTs</h2>
          {isConnected ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {mockUserNFTs.map((nft) => (
                <Card key={nft.id} className="crypto-card border-0 overflow-hidden group cursor-pointer">
                  <div className="relative">
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
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
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <Wallet className="w-12 h-12 text-gray-600 mb-4" />
              <p className="text-gray-400 mb-4">Connect your wallet to view your NFT collection.</p>
              <div className="w-48">
                <WalletConnect />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setEditOpen(false)}
        >
          <Card
            className="max-w-md w-full bg-gray-900 border-gray-700 p-6 relative max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEditOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-1">Edit Profile</h2>
            <p className="text-sm text-gray-400 mb-5">Customize your display name and social links</p>

            {/* Display Name Section */}
            <div className="mb-6">
              <Label className="text-sm font-medium text-gray-300 mb-2 block">Display Name</Label>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setEditNameType("wallet")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    editNameType === "wallet"
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 text-white"
                      : "bg-gray-800 border border-gray-700 text-gray-400 hover:text-white"
                  }`}
                >
                  Wallet Address
                </button>
                <button
                  onClick={() => setEditNameType("username")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    editNameType === "username"
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 text-white"
                      : "bg-gray-800 border border-gray-700 text-gray-400 hover:text-white"
                  }`}
                >
                  Username
                </button>
              </div>
              {editNameType === "username" && (
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter username or ENS (.eth, .bnb, .arb...)"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                />
              )}
              {editNameType === "wallet" && address && (
                <p className="text-xs text-gray-500 font-mono mt-1 truncate">{address}</p>
              )}
            </div>

            {/* Social Links Section */}
            <div className="mb-6">
              <Label className="text-sm font-medium text-gray-300 mb-3 block">Social Links</Label>
              <div className="space-y-3">
                {SOCIAL_PLATFORMS.map((platform) => (
                  <div key={platform.key} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <platform.icon className="w-4 h-4 text-gray-400" />
                    </div>
                    <Input
                      value={editSocials[platform.key] || ""}
                      onChange={(e) =>
                        setEditSocials((prev) => ({ ...prev, [platform.key]: e.target.value }))
                      }
                      placeholder={platform.placeholder}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Save / Cancel */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setEditOpen(false)}
                className="flex-1 border-gray-600 hover:bg-gray-700 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={saveProfile}
                className="flex-1 text-white border-0"
                style={{ background: "linear-gradient(45deg, #00d4ff, #ff00ff)" }}
              >
                Save Profile
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  );
}
