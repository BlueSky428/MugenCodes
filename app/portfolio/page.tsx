"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Section } from "@/components/Section";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  id: string;
  name: string;
  category: string;
  description: string;
  liveUrl: string;
  image?: string;
  technologies?: string[];
  client?: string;
};

const projects: Project[] = [
  // Blockchain Payment & DePIN Solutions
  {
    id: "1",
    name: "Pundi X",
    category: "Blockchain",
    description: "DePIN Solutions platform providing blockchain-based point-of-sale (XPOS) systems for physical retail businesses. Enables borderless payment ecosystem beyond fiat with crypto payment integration.",
    liveUrl: "https://pundix.com",
    technologies: ["Blockchain", "DePIN", "Smart Contracts", "Payment Systems"],
  },
  {
    id: "2",
    name: "MintMe",
    category: "Blockchain",
    description: "Token creation and trading platform where users can create AI agent coins, meme coins, or project tokens. Multi-blockchain support including Ethereum, Binance Chain, Solana, Base, and Avalanche.",
    liveUrl: "https://www.mintme.com",
    technologies: ["Blockchain", "Multi-chain", "Token Creation", "Trading Platform"],
  },
  
  // Cryptocurrency Exchanges - Major Platforms
  {
    id: "3",
    name: "Binance",
    category: "Blockchain",
    description: "World's leading cryptocurrency exchange platform with comprehensive trading features, spot trading, futures, and extensive coin listings. Serving millions of users globally with advanced security.",
    liveUrl: "https://www.binance.com/",
    technologies: ["Blockchain", "Trading Engine", "Security", "Multi-asset"],
  },
  {
    id: "4",
    name: "Coinbase Pro",
    category: "Blockchain",
    description: "Professional cryptocurrency trading platform with advanced charting, order types, and API access. Designed for active traders with low fees and high liquidity.",
    liveUrl: "https://pro.coinbase.com",
    technologies: ["Blockchain", "Trading API", "Advanced Trading", "Security"],
  },
  {
    id: "5",
    name: "Bitfinex",
    category: "Blockchain",
    description: "Advanced cryptocurrency trading platform offering margin trading, lending, and derivatives. Known for deep liquidity and professional trading features.",
    liveUrl: "https://www.bitfinex.com",
    technologies: ["Blockchain", "Margin Trading", "Lending", "Derivatives"],
  },
  {
    id: "6",
    name: "WhiteBIT",
    category: "Blockchain",
    description: "European cryptocurrency exchange with over 780 trading pairs. Offers spot trading, margin trading, futures, and crypto borrowing services with high security standards.",
    liveUrl: "https://whitebit.com",
    technologies: ["Blockchain", "Trading Platform", "Security", "Multi-product"],
  },
  {
    id: "7",
    name: "LBank",
    category: "Blockchain",
    description: "International cryptocurrency exchange platform offering spot trading, futures, and various financial products. Features 800+ cryptocurrencies, copy trading, and serves users in 210+ countries.",
    liveUrl: "https://www.lbank.info/",
    technologies: ["Blockchain", "Trading Platform", "Futures", "Security"],
  },
  {
    id: "9",
    name: "BitForex",
    category: "Blockchain",
    description: "World's leading one-stop digital asset service platform with perpetual contracts, spot trading, and insured assets. Serving over 3.5 million users across 180+ countries.",
    liveUrl: "https://bitforex.com",
    technologies: ["Blockchain", "Perpetual Contracts", "Trading Platform", "Security"],
  },
  {
    id: "10",
    name: "LA Token",
    category: "Blockchain",
    description: "Cryptocurrency exchange platform with 1207+ trading pairs and 28113+ tokens. Features token launches, staking, rewards, and mobile app with 30,000+ 5-star reviews.",
    liveUrl: "https://latoken.com/",
    technologies: ["Blockchain", "Token Launches", "Staking", "Mobile App"],
  },
  {
    id: "11",
    name: "Hotbit",
    category: "Blockchain",
    description: "Decentralized derivatives exchange with up to 50x leverage, 0 price impact, and low fees. Powered by LPBASE with high yield for liquidity providers.",
    liveUrl: "https://www.hotbit.io/",
    technologies: ["Blockchain", "DeFi", "Derivatives", "Leverage Trading"],
  },
  {
    id: "12",
    name: "Bilaxy",
    category: "Blockchain",
    description: "Advanced token swap platform with intelligent filtering for discovering new blockchain tokens. Features real-time analytics, large transaction tracking, and MEV protection.",
    liveUrl: "https://bilaxy.com/",
    technologies: ["Blockchain", "Token Swap", "Analytics", "DEX"],
  },
  {
    id: "13",
    name: "HitBTC",
    category: "Blockchain",
    description: "Advanced cryptocurrency exchange with extensive coin listings and trading pairs. Offers professional trading tools, API access for automated trading, and industry-leading fee tiers.",
    liveUrl: "https://hitbtc.com",
    technologies: ["Blockchain", "Trading Platform", "API", "Multi-asset"],
  },
  {
    id: "14",
    name: "BKEX",
    category: "Blockchain",
    description: "Global digital asset trading platform offering spot trading, futures, and various financial products. Serves users worldwide with secure and efficient services.",
    liveUrl: "https://www.bkex.com/",
    technologies: ["Blockchain", "Trading Platform", "Futures", "Security"],
  },
  {
    id: "15",
    name: "Paybito",
    category: "Blockchain",
    description: "White-label crypto exchange and payment platform offering comprehensive business solutions. Enables entrepreneurs to launch crypto businesses in minutes with 50,000+ business owners using the platform.",
    liveUrl: "https://www.paybito.com",
    technologies: ["Blockchain", "White-label", "Payment Processing", "Business Solutions"],
  },
  
  // AI & Automation Platforms
  {
    id: "18",
    name: "Agent.so",
    category: "AI",
    description: "AI agent platform for automating workflows and business processes with intelligent automation solutions.",
    liveUrl: "https://www.agent.so/",
    technologies: ["AI", "Automation", "Workflow", "SaaS"],
  },
  {
    id: "2",
    name: "Aisera",
    category: "AI",
    description: "AI-powered service experience platform that automates customer service and IT operations with conversational AI.",
    liveUrl: "https://aisera.com/",
    technologies: ["AI", "Customer Service", "Automation", "NLP"],
  },
  {
    id: "3",
    name: "Raia AI",
    category: "AI",
    description: "AI platform providing intelligent solutions for business automation and digital transformation.",
    liveUrl: "https://www.raiaai.com/",
    technologies: ["AI", "Machine Learning", "Automation", "SaaS"],
  },
  {
    id: "4",
    name: "WebAgent.ai",
    category: "AI",
    description: "AI-powered web automation platform that enables intelligent browsing and task automation.",
    liveUrl: "https://webagent.ai/",
    technologies: ["AI", "Web Automation", "Browser Automation", "RPA"],
  },
  {
    id: "5",
    name: "Autonomous AI Agents",
    category: "AI",
    description: "Platform for creating and deploying autonomous AI agents for various business applications.",
    liveUrl: "https://autonomousaiagents.io",
    technologies: ["AI", "Autonomous Agents", "Machine Learning", "Automation"],
  },
  {
    id: "6",
    name: "Spider Connect",
    category: "Full-stack",
    description: "Connectivity and integration platform for seamless business process automation.",
    liveUrl: "https://spider-connect.com",
    technologies: ["Integration", "API", "Automation", "Connectivity"],
  },
  {
    id: "7",
    name: "Anysphere",
    category: "AI",
    description: "AI-powered development platform that enhances coding productivity with intelligent assistance.",
    liveUrl: "https://anysphere.com",
    technologies: ["AI", "Development Tools", "Code Generation", "Productivity"],
  },
  {
    id: "9",
    name: "Copy.ai",
    category: "AI",
    description: "AI-powered copywriting platform that generates marketing copy, content, and creative text for businesses.",
    liveUrl: "https://copy.ai",
    technologies: ["AI", "Content Generation", "Marketing", "NLP"],
  },
  {
    id: "10",
    name: "Stackpack AI",
    category: "AI",
    description: "AI platform providing intelligent solutions for business operations and automation.",
    liveUrl: "https://www.stackpack.ai",
    technologies: ["AI", "Business Automation", "SaaS", "Machine Learning"],
  },
  {
    id: "11",
    name: "Mpathic AI",
    category: "AI",
    description: "AI-powered platform for empathetic communication and customer engagement solutions.",
    liveUrl: "http://www.mpathic.ai",
    technologies: ["AI", "Communication", "Customer Engagement", "NLP"],
  },
  {
    id: "12",
    name: "Chirpley",
    category: "AI",
    description: "Automated peer-to-peer influencer marketplace focused on nano and micro influencers with AI matching.",
    liveUrl: "https://chirpley.ai/",
    technologies: ["AI", "Influencer Marketing", "Marketplace", "Blockchain"],
  },
  
  // Travel & Hospitality
  {
    id: "13",
    name: "Dohop",
    category: "Full-stack",
    description: "Flight search and booking platform that helps travelers find the best flight combinations and deals.",
    liveUrl: "https://www.dohop.com",
    technologies: ["Travel", "Flight Search", "Booking Engine", "API Integration"],
  },
  {
    id: "14",
    name: "Sonder",
    category: "Full-stack",
    description: "Hospitality platform offering thoughtfully designed, tech-enabled accommodations in prime urban locations.",
    liveUrl: "https://www.sonder.com",
    technologies: ["Hospitality", "Tech-Enabled", "Urban Accommodations", "Mobile App"],
  },
  
  // Business & SaaS Platforms
  {
    id: "15",
    name: "Weglot",
    category: "Full-stack",
    description: "Website translation and multilingual solution that makes websites available in multiple languages instantly.",
    liveUrl: "https://weglot.com",
    technologies: ["Translation", "Multilingual", "SaaS", "CMS Integration"],
  },
  {
    id: "16",
    name: "Zesty.io",
    category: "Full-stack",
    description: "Headless CMS platform that enables developers to build and manage content across multiple channels.",
    liveUrl: "https://zesty.io",
    technologies: ["CMS", "Headless", "Content Management", "API"],
  },
  {
    id: "17",
    name: "SeaTable",
    category: "Full-stack",
    description: "Collaborative database platform that combines spreadsheet simplicity with database power for team collaboration.",
    liveUrl: "https://seatable.io/en/",
    technologies: ["Database", "Collaboration", "Spreadsheet", "Team Tools"],
  },
  {
    id: "18",
    name: "StackHawk",
    category: "Full-stack",
    description: "Application security testing platform that helps developers find and fix security vulnerabilities in their code.",
    liveUrl: "https://stackhawk.com",
    technologies: ["Security", "DevSecOps", "Testing", "CI/CD"],
  },
  {
    id: "19",
    name: "Pitch",
    category: "Full-stack",
    description: "Collaborative presentation software that helps teams create beautiful, interactive presentations together.",
    liveUrl: "https://pitch.com",
    technologies: ["Presentations", "Collaboration", "Design", "Real-time"],
  },
  {
    id: "20",
    name: "Hopin",
    category: "Full-stack",
    description: "Virtual events platform that enables organizations to host engaging online events, conferences, and webinars.",
    liveUrl: "https://hopin.com",
    technologies: ["Virtual Events", "Video Conferencing", "Event Management", "Live Streaming"],
  },
  {
    id: "21",
    name: "Fieldwire",
    category: "Full-stack",
    description: "Construction management software that helps construction teams collaborate, track progress, and manage projects.",
    liveUrl: "https://fieldwire.com",
    technologies: ["Construction", "Project Management", "Mobile App", "Collaboration"],
  },
  {
    id: "22",
    name: "FeatureSpace",
    category: "AI",
    description: "Fraud prevention and detection platform using machine learning to protect businesses from financial crime.",
    liveUrl: "https://featurespace.com",
    technologies: ["Fraud Detection", "Machine Learning", "Financial Security", "AI"],
  },
  {
    id: "23",
    name: "Pivot",
    category: "AI",
    description: "Digital insurance marketplace and AI solutions platform enabling agents to sell and manage insurance products.",
    liveUrl: "https://pivot.com",
    technologies: ["Insurance", "Marketplace", "AI Solutions", "Digital Insurance"],
  },
  
  // Creative & Design Studios
  {
    id: "24",
    name: "Lusion",
    category: "Full-stack",
    description: "Digital production studio creating visually captivating designs and interactive experiences for brands.",
    liveUrl: "https://lusion.co",
    technologies: ["Design", "3D", "Interactive", "Digital Production"],
  },
  {
    id: "25",
    name: "Flatstudio",
    category: "Full-stack",
    description: "Creative digital agency developing complex interface systems for Web, Mobile & AR applications.",
    liveUrl: "https://flatstudio.co/",
    technologies: ["Design", "Interface Design", "Mobile", "AR"],
  },
  {
    id: "26",
    name: "Blend4Web",
    category: "Full-stack",
    description: "3D web technology platform enabling interactive 3D applications in browsers without plugins using WebGL.",
    liveUrl: "https://www.blend4web.com/",
    technologies: ["3D", "WebGL", "Interactive", "3D Visualization"],
  },
  {
    id: "60",
    name: "Playground.xyz",
    category: "AI",
    description: "Advertising platform using AI and contextual targeting to deliver personalized, relevant ad experiences.",
    liveUrl: "https://playground.xyz/",
    technologies: ["Advertising", "AI", "Contextual Targeting", "Ad Tech"],
  },
  
  // Technology & Hardware
  {
    id: "27",
    name: "Hesai Technology",
    category: "Full-stack",
    description: "Global leader in LiDAR sensor solutions for autonomous vehicles, robotics, and industrial applications.",
    liveUrl: "https://www.hesaitech.com/",
    technologies: ["LiDAR", "Autonomous Vehicles", "Robotics", "Hardware"],
  },
  {
    id: "28",
    name: "Evervault",
    category: "Full-stack",
    description: "Data security platform providing encryption and privacy solutions for modern applications.",
    liveUrl: "https://evervault.com/",
    technologies: ["Security", "Encryption", "Privacy", "Data Protection"],
  },
  {
    id: "29",
    name: "Trivver",
    category: "AI",
    description: "AR and VR marketing platform with AI engine for immersive advertising and interactive experiences.",
    liveUrl: "https://trivver.com",
    technologies: ["AR/VR", "Marketing", "AI", "Immersive Tech"],
  },
  {
    id: "30",
    name: "Pixelynx",
    category: "AI",
    description: "KOR Protocol infrastructure for AI entertainment, enabling creators to build interactive music and IP experiences.",
    liveUrl: "https://pixelynx.io",
    technologies: ["Blockchain", "Entertainment", "AI", "Music Tech"],
  },
  
  // E-commerce & Retail
  {
    id: "31",
    name: "Sussex Taps",
    category: "Full-stack",
    description: "Australian tapware manufacturer creating premium, carbon-neutral tapware with sustainable manufacturing practices.",
    liveUrl: "https://sussextaps.com.au",
    technologies: ["E-commerce", "Manufacturing", "Sustainability", "Product Catalog"],
  },
  
  // Services & Business
  {
    id: "32",
    name: "J&D Landscaping",
    category: "Full-stack",
    description: "Hardscaping and landscaping services platform with 3D rendering, project management, and customer portal.",
    liveUrl: "https://jdlandscaping.net",
    technologies: ["Services", "3D Rendering", "Project Management", "Customer Portal"],
  },
  {
    id: "33",
    name: "Boga Group",
    category: "Full-stack",
    description: "Restaurant group operating multiple brands across Indonesia with digital ordering and loyalty platform.",
    liveUrl: "https://boga.id/",
    technologies: ["Restaurant", "Multi-brand", "Mobile App", "Loyalty Program"],
  },
];

const categories = ["All", "AI", "Blockchain", "Full-stack"];

function PortfolioContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const portfolioRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const projectsGridRef = useRef<HTMLDivElement>(null);
  
  // Map URL parameter to valid category, default to "All"
  const getValidCategory = (param: string | null): string => {
    if (!param) return "All";
    const validCategories = ["All", "AI", "Blockchain", "Full-stack"];
    const lowerParam = param.toLowerCase();
    
    // Handle different variations
    if (lowerParam === "full-stack" || lowerParam === "fullstack" || lowerParam === "full stack") {
      return "Full-stack";
    }
    if (lowerParam === "blockchain") {
      return "Blockchain";
    }
    if (lowerParam === "ai") {
      return "AI";
    }
    
    // Try exact match with capitalized first letter
    const normalizedParam = param.charAt(0).toUpperCase() + param.slice(1).toLowerCase();
    if (validCategories.includes(normalizedParam)) {
      return normalizedParam;
    }
    
    return "All";
  };
  
  const [selectedCategory, setSelectedCategory] = useState(() => getValidCategory(categoryParam));
  
  // Update category when URL parameter changes
  useEffect(() => {
    const category = getValidCategory(categoryParam);
    setSelectedCategory(category);
  }, [categoryParam]);
  
  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  // Initialize GSAP smooth scroll and animations
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Enhanced smooth scrolling for the entire page
    let scrollTween: gsap.core.Tween | null = null;
    let isScrolling = false;
    let currentScroll = 0;

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }

      const delta = e.deltaY;
      currentScroll = window.scrollY || document.documentElement.scrollTop;
      const targetScroll = Math.max(0, Math.min(
        currentScroll + delta * 0.5,
        document.documentElement.scrollHeight - window.innerHeight
      ));

      if (scrollTween) scrollTween.kill();

      isScrolling = true;
      scrollTween = gsap.to(document.documentElement, {
        duration: 0.6,
        scrollTop: targetScroll,
        ease: "power2.out",
        onComplete: () => {
          isScrolling = false;
        },
      });

      e.preventDefault();
    };

    // Only enable smooth scroll on desktop (mouse wheel)
    if (window.innerWidth > 768) {
      window.addEventListener("wheel", handleWheel, { passive: false });
    }

    // Hero section animations
    if (heroRef.current) {
      const heroElements = heroRef.current.querySelectorAll(".animate-fade-in-up, .animate-fade-in-down");
      gsap.fromTo(
        heroElements,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Project cards scroll animations
    if (projectsGridRef.current) {
      const projectCards = projectsGridRef.current.querySelectorAll(".project-card");
      
      projectCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 50,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card as Element,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );

        // Hover animation enhancement
        const cardElement = card as HTMLElement;
        cardElement.addEventListener("mouseenter", () => {
          gsap.to(card, {
            scale: 1.02,
            y: -5,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        cardElement.addEventListener("mouseleave", () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });
    }

    // Smooth scroll for anchor links
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a[href^='#']");
      if (link) {
        e.preventDefault();
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            const targetPosition = (targetElement as HTMLElement).offsetTop - 80;
            gsap.to(document.documentElement, {
              duration: 1,
              scrollTop: targetPosition,
              ease: "power2.inOut",
            });
          }
        }
      }
    };

    document.addEventListener("click", handleSmoothScroll);

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      document.removeEventListener("click", handleSmoothScroll);
      if (scrollTween) scrollTween.kill();
      window.removeEventListener("wheel", handleWheel);
    };
  }, [filteredProjects, selectedCategory]);

  return (
    <div ref={portfolioRef}>
      {/* Hero Section */}
      <section ref={heroRef} className="bg-hero relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 opacity-[0.15] dark:opacity-[0.08] bg-grid" />
        <div className="container-page relative py-20 md:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-primary-200 bg-gray-50/80 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-gray-900 shadow-sm animate-fade-in-down dark:border-primary-800 dark:bg-gray-800/80 dark:text-white">
              <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
              Our Work
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-black md:text-6xl lg:text-7xl dark:text-white animate-fade-in-up">
              Project{" "}
              <span className="text-gradient bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent dark:from-primary-400 dark:to-primary-300">
                Portfolio
              </span>
            </h1>
            <p className="mt-6 text-lg muted md:text-xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Explore our completed projects and see the live websites we&apos;ve developed. Each project represents our commitment to quality, innovation, and client success.
            </p>
          </div>
        </div>
      </section>

      <Section eyebrow="Portfolio" title="Completed Projects">
        <div className="space-y-8">
          {/* Category Filter */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`btn px-6 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category
                      ? "btn-primary"
                      : "btn-secondary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            {/* Project Count */}
            <div className="text-center">
              <p className="text-sm muted">
                {selectedCategory === "All" ? (
                  <>
                    Showing <span className="font-semibold text-ink dark:text-white">{filteredProjects.length}</span> projects
                  </>
                ) : (
                  <>
                    Showing <span className="font-semibold text-ink dark:text-white">{filteredProjects.length}</span> of <span className="font-semibold text-ink dark:text-white">{projects.length}</span> projects
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Projects Grid */}
          <div ref={projectsGridRef} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="project-card card card-dark card-hover p-6 h-full flex flex-col group"
              >
                {/* Category Badge */}
                <div className="mb-4">
                  <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border-primary-200 dark:border-primary-800">
                    {project.category}
                  </span>
                </div>

                {/* Project Title */}
                <h3 className="text-xl font-semibold text-ink dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  {project.name}
                </h3>

                {/* Description */}
                <p className="muted mb-4 flex-1 leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Live Site Link */}
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full mt-auto flex items-center justify-center gap-2 group/link"
                >
                  Visit Live Site
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="card card-dark p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-base font-medium text-ink dark:text-white">No projects found</p>
              <p className="text-sm muted mt-1">Try selecting a different category</p>
            </div>
          )}
        </div>
      </Section>

      {/* CTA Section */}
      <Section eyebrow="Get Started" title="Ready to start your project?">
        <div className="max-w-2xl mx-auto text-center">
          <p className="muted mb-8 text-lg">
            Let&apos;s discuss how we can bring your vision to life with the same quality and attention to detail shown in our portfolio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/projects/new" className="btn btn-primary px-8 py-4 text-base rounded-2xl">
              Start a Project
            </Link>
            <Link href="/contact" className="btn btn-secondary px-8 py-4 text-base rounded-2xl">
              Contact Us
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={
      <Section eyebrow="Portfolio" title="Loading...">
        <div className="card card-dark p-8">
          <p className="muted">Loading portfolio...</p>
        </div>
      </Section>
    }>
      <PortfolioContent />
    </Suspense>
  );
}
