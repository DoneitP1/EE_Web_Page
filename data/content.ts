import { LucideIcon, Code2, Database, Layout, Terminal, Users, Globe } from "lucide-react";

export type Content = {
    hero: {
        greeting: string;
        title: string;
        subtitle: string;
        description: string;
        ctaPrimary: string;
        ctaSecondary: string;
    };
    about: {
        title: string;
        description: string[];
    };
    projects: {
        title: string;
        items: {
            title: string;
            description: string;
            tech: string[];
            link?: string;
            image?: string;
            slug: string;
            details: {
                problem: string;
                solution: string;
                architecture: string;
                images: string[];
            };
        }[];
    };
    skills: {
        title: string;
        categories: {
            name: string;
            items: {
                name: string;
                desc: string;
            }[];
        }[];
    };
    footer: {
        rights: string;
    };
    nav: {
        about: string;
        projects: string;
        skills: string;
        contact: string;
        downloadCv: string;
    };
};

export const content: Record<'en' | 'tr', Content> = {
    en: {
        nav: {
            about: "About",
            projects: "Projects",
            skills: "Skills",
            contact: "Contact",
            downloadCv: "Download CV"
        },
        hero: {
            greeting: "Hi, I'm",
            title: "Emirhan Ertürk",
            subtitle: "Computer Science Student",
            description: "I focus on Data Science, Python, and Full Stack Development. Building modern web solutions with a clean aesthetic.",
            ctaPrimary: "View Projects",
            ctaSecondary: "About Me"
        },
        about: {
            title: "About Me",
            description: [
                "I love discovering how computers can do more than just process data—they can simplify life. As a CS student, my main focus is the intersection of Data Science and Web Technologies.",
                "I enjoy producing across a wide range, from developing tools that analyze Formula 1 telemetry data to designing user-friendly web interfaces. For me, every line of code is part of a larger puzzle.",
                "My goal is to combine my analytical mindset with creative solutions."
            ]
        },
        projects: {
            title: "Featured Projects",
            items: [
                {
                    title: "WellNest",
                    description: "A wellness and self-care platform offering personalized plans and mindfulness exercises with smooth animations.",
                    tech: ["React", "Tailwind CSS", "Framer Motion", "Material-UI"],
                    link: "https://github.com/DoneitP1/WellNest",
                    image: "/wellnest.png",
                    slug: "wellnest",
                    details: {
                        problem: "Modern life is stressful, but building healthy habits feels like a chore. Users often struggle to find personalized, engaging wellness routines.",
                        solution: "WellNest gamifies wellness with a personalized, AI-driven platform. It combines mindfulness exercises, habit tracking, and mood analysis into a fluid, animated experience.",
                        architecture: "Built with React for a dynamic UI, Framer Motion for smooth, calming animations, and Material-UI for accessible component design. State management ensures seamless user progress tracking.",
                        images: ["/wellnest.png"]
                    }
                },
                {
                    title: "NeuralLap",
                    description: "Until today, simulation tools only showed you what you did. Neural Lap tells you what you need to do. Meet the world's first Bionic Racing Assistant for iRacing and ACC. A system that processes classic telemetry data with AI to draw 'Live AR Error Lines' on the track, monitors your heart rate to calm you down during stress, and generates strategies for you while you sleep. Drive not just faster; drive smarter. This is not an add-on, it's your unfair advantage.",
                    tech: ["Python", "Data Science", "React", "FastAPI"],
                    link: "https://github.com/DoneitP1/NeuralLap",
                    image: "/neurallap.png",
                    slug: "neurallap",
                    details: {
                        problem: "Sim racers drown in raw telemetry data without actionable insights. Understanding where to gain time requires expert knowledge that most drivers lack.",
                        solution: "NeuralLap acts as a Bionic Racing Assistant. It processes telemetry in real-time to overlay AR 'Error Lines' on the track and provides strategic advice, effectively coaching the driver.",
                        architecture: "The backend uses Python and FastAPI for high-performance data processing. FastF1 handles telemetry ingestion, while Machine Learning models analyze driving patterns. The frontend is a React dashboard visualizing complex data simply.",
                        images: ["/neurallap.png"]
                    }
                },
                {
                    title: "LapMaster",
                    description: "Full-stack analysis platform built with React and Flask. Leverages FastF1 API and Machine Learning to provide detailed telemetry insights, interactive track maps, and race strategy visualization.",
                    tech: ["React", "TypeScript", "Next.js"],
                    link: "https://github.com/DoneitP1/LapMaster",
                    image: "/lapmaster.png",
                    slug: "lapmaster",
                    details: {
                        problem: "Finding the perfect lap time is difficult when data is scattered. Racers need a unified view of their sector times and theoretical bests.",
                        solution: "LapMaster aggregates timing data to calculate the theoretical best lap. It visualizes sector performance and highlights specific areas for improvement.",
                        architecture: "A Flask (Python) backend analyzes laptimes, while the React frontend presents interactive charts and comparison tools. Data is stored and retrieved efficiently to allow historical analysis.",
                        images: [
                            "/lapmaster-detail-3.png",
                            "/lapmaster-detail-2.png",
                            "/lapmaster-detail-1.png",
                            "/lapmaster-detail-4.png",
                            "/lapmaster-detail-5.png",
                            "/lapmaster-detail-6.png",
                            "/lapmaster-detail-7.png",
                            "/lapmaster-detail-8.png",
                            "/lapmaster-detail-9.png",
                            "/lapmaster-detail-10.png",
                            "/lapmaster-detail-11.png",
                            "/lapmaster-detail-12.png",
                            "/lapmaster-detail-13.png",
                            "/lapmaster-detail-14.png",
                            "/lapmaster-detail-15.png",
                            "/lapmaster-detail-16.png",
                            "/lapmaster-detail-17.png",
                            "/lapmaster-detail-18.png",
                            "/lapmaster-detail-19.png",
                            "/lapmaster-detail-20.png",
                            "/lapmaster-detail-21.png"
                        ]
                    }
                }
            ]
        },
        skills: {
            title: "Skills & Technologies",
            categories: [
                {
                    name: "Languages",
                    items: [
                        { name: "Python", desc: "Data analysis & automation" },
                        { name: "JavaScript", desc: "Interactive web experiences" },
                        { name: "TypeScript", desc: "Type-safe development" },
                        { name: "SQL", desc: "Database management" },
                        { name: "C++", desc: "System performance" }
                    ]
                },
                {
                    name: "Frontend",
                    items: [
                        { name: "React", desc: "Component-based UI" },
                        { name: "Next.js", desc: "Production React framework" },
                        { name: "Tailwind CSS", desc: "Utility-first styling" },
                        { name: "HTML5", desc: "Structural semantic markup" },
                        { name: "CSS3", desc: "Modern visual styling" }
                    ]
                },
                {
                    name: "Backend & Data",
                    items: [
                        { name: "Node.js", desc: "Server-side JavaScript" },
                        { name: "FastAPI", desc: "High-performance Python APIs" },
                        { name: "PostgreSQL", desc: "Relational database" },
                        { name: "Pandas", desc: "Data manipulation" },
                        { name: "NumPy", desc: "Scientific computing" }
                    ]
                },
                {
                    name: "Tools",
                    items: [
                        { name: "Git", desc: "Version control system" },
                        { name: "Docker", desc: "Containerization" },
                        { name: "VS Code", desc: "Primary IDE" },
                        { name: "Figma", desc: "UI/UX Design" }
                    ]
                }
            ]
        },
        footer: {
            rights: "All rights reserved."
        }
    },
    tr: {
        nav: {
            about: "Hakkımda",
            projects: "Projeler",
            skills: "Yetenekler",
            contact: "İletişim",
            downloadCv: "CV İndir"
        },
        hero: {
            greeting: "Merhaba, ben",
            title: "Emirhan Ertürk",
            subtitle: "Bilgisayar Mühendisliği Öğrencisi",
            description: "Veri Bilimi, Python ve Full Stack Geliştirme üzerine odaklanıyorum. Temiz bir estetikle modern web çözümleri üretiyorum.",
            ctaPrimary: "Projeleri Gör",
            ctaSecondary: "Hakkımda"
        },
        about: {
            title: "Hakkımda",
            description: [
                "Bir bilgisayarın sadece işlem yapmaktan öte, hayatı nasıl kolaylaştırabileceğini keşfetmeyi seviyorum. Bir CS öğrencisi olarak ana odağım, Veri Bilimi ve Web Teknolojilerinin kesişim noktası.",
                "Formula 1 telemetri verilerini analiz eden araçlar geliştirmekten, kullanıcı dostu web arayüzleri tasarlamaya kadar geniş bir yelpazede üretmeyi seviyorum. Benim için her satır kod, daha büyük bir bulmacanın parçası.",
                "Hedefim, analitik düşünce yapımı yaratıcı çözümlerle birleştirmek."
            ]
        },
        projects: {
            title: "Öne Çıkan Projeler",
            items: [
                {
                    title: "WellNest",
                    description: "Kişiselleştirilmiş planlar ve farkındalık egzersizleri sunan, akıcı animasyonlara sahip bir sağlık ve kişisel bakım platformu.",
                    tech: ["React", "Tailwind CSS", "Framer Motion", "Material-UI"],
                    link: "https://github.com/DoneitP1/WellNest",
                    image: "/wellnest.png",
                    slug: "wellnest",
                    details: {
                        problem: "Modern hayat stresli, ancak sağlıklı alışkanlıklar edinmek zorlayıcı olabiliyor. Kullanıcılar genellikle kişiselleştirilmiş ve ilgi çekici sağlık rutinleri bulmakta zorlanıyor.",
                        solution: "WellNest, sağlığı kişiselleştirilmiş, yapay zeka destekli bir platformla oyunlaştırıyor. Farkındalık egzersizlerini, alışkanlık takibini ve ruh hali analizini akıcı, animasyonlu bir deneyimde birleştiriyor.",
                        architecture: "Dinamik bir kullanıcı arayüzü için React, pürüzsüz animasyonlar için Framer Motion ve erişilebilir bileşen tasarımı için Material-UI ile oluşturuldu.",
                        images: ["/wellnest.png"]
                    }
                },
                {
                    title: "NeuralLap",
                    description: "Bugüne kadar simülasyon araçları size sadece ne yaptığınızı gösterdi. Neural Lap ise size ne yapmanız gerektiğini söyler. iRacing ve ACC için geliştirilen dünyanın ilk Biyonik Yarış Asistanı ile tanışın. Klasik telemetri verilerini Yapay Zeka ile işleyerek pistin üzerine 'Canlı AR Hata Çizgileri' çizen, nabzınızı takip edip stres anında sizi sakinleştiren ve siz uyurken sizin yerinize strateji üreten bir sistem. Sadece daha hızlı değil; daha akıllı sürün. Bu bir eklenti değil, haksız avantajınız.",
                    tech: ["Python", "Data Science", "React", "FastAPI"],
                    link: "https://github.com/DoneitP1/NeuralLap",
                    image: "/neurallap.png",
                    slug: "neurallap",
                    details: {
                        problem: "Simülasyon yarışçıları işlenebilir içgörüler olmadan ham veri içinde boğuluyor. Zaman kazanılacak yerleri anlamak çoğu sürücüde olmayan uzmanlık bilgisi gerektiriyor.",
                        solution: "NeuralLap, Biyonik Yarış Asistanı olarak hareket eder. Telemetriyi gerçek zamanlı işleyerek pist üzerine AR 'Hata Çizgileri' çizer ve stratejik tavsiyeler verir.",
                        architecture: "Backend, yüksek performanslı veri işleme için Python ve FastAPI kullanır. FastF1 telemetri alımını yönetirken, Makine Öğrenimi modelleri sürüş modellerini analiz eder. Frontend, karmaşık verileri basitçe görselleştiren bir React panelidir.",
                        images: ["/neurallap.png"]
                    }
                },
                {
                    title: "LapMaster",
                    description: "React ve Flask ile oluşturulmuş Full-stack analiz platformu. Ayrıntılı telemetri içgörüleri, etkileşimli pist haritaları ve yarış stratejisi görselleştirmesi sağlamak için FastF1 API ve Makine Öğreniminden yararlanır.",

                    tech: ["React", "TypeScript", "Next.js"],
                    link: "https://github.com/DoneitP1/LapMaster",
                    image: "/lapmaster.png",
                    slug: "lapmaster",
                    details: {
                        problem: "Veriler dağınık olduğunda mükemmel tur zamanını bulmak zordur. Yarışçıların sektör zamanlarına ve teorik en iyi derecelerine toplu bir bakışa ihtiyacı vardır.",
                        solution: "LapMaster, teorik en iyi turu hesaplamak için zamanlama verilerini toplar. Sektör performansını görselleştirir ve gelişim alanlarını vurgular.",
                        architecture: "Flask (Python) backend tur zamanlarını analiz ederken, React frontend etkileşimli grafikler sunar. Veriler, geçmiş analizine izin vermek için verimli bir şekilde saklanır.",
                        images: [
                            "/lapmaster-detail-3.png",
                            "/lapmaster-detail-2.png",
                            "/lapmaster-detail-1.png",
                            "/lapmaster-detail-4.png",
                            "/lapmaster-detail-5.png",
                            "/lapmaster-detail-6.png",
                            "/lapmaster-detail-7.png",
                            "/lapmaster-detail-8.png",
                            "/lapmaster-detail-9.png",
                            "/lapmaster-detail-10.png",
                            "/lapmaster-detail-11.png",
                            "/lapmaster-detail-12.png",
                            "/lapmaster-detail-13.png",
                            "/lapmaster-detail-14.png",
                            "/lapmaster-detail-15.png",
                            "/lapmaster-detail-16.png",
                            "/lapmaster-detail-17.png",
                            "/lapmaster-detail-18.png",
                            "/lapmaster-detail-19.png",
                            "/lapmaster-detail-20.png",
                            "/lapmaster-detail-21.png"
                        ]
                    }
                }
            ]
        },
        skills: {
            title: "Yetenekler & Teknolojiler",
            categories: [
                {
                    name: "Diller",
                    items: [
                        { name: "Python", desc: "Veri analizi ve otomasyon" },
                        { name: "JavaScript", desc: "İnteraktif web deneyimleri" },
                        { name: "TypeScript", desc: "Tip güvenli geliştirme" },
                        { name: "SQL", desc: "Veritabanı yönetimi" },
                        { name: "C++", desc: "Sistem performansı" }
                    ]
                },
                {
                    name: "Frontend",
                    items: [
                        { name: "React", desc: "Bileşen tabanlı arayüzler" },
                        { name: "Next.js", desc: "Modern React framework" },
                        { name: "Tailwind CSS", desc: "Hızlı stil geliştirme" },
                        { name: "HTML5", desc: "Yapısal semantik işaretleme" },
                        { name: "CSS3", desc: "Modern görsel stil" }
                    ]
                },
                {
                    name: "Backend & Veri",
                    items: [
                        { name: "Node.js", desc: "Sunucu taraflı JavaScript" },
                        { name: "FastAPI", desc: "Yüksek performanslı Python API" },
                        { name: "PostgreSQL", desc: "İlişkisel veritabanı" },
                        { name: "Pandas", desc: "Veri manipülasyonu" },
                        { name: "NumPy", desc: "Bilimsel hesaplama" }
                    ]
                },
                {
                    name: "Araçlar",
                    items: [
                        { name: "Git", desc: "Versiyon kontrol sistemi" },
                        { name: "Docker", desc: "Konteynerizasyon" },
                        { name: "VS Code", desc: "Ana geliştirme ortamı" },
                        { name: "Figma", desc: "Arayüz Tasarımı" }
                    ]
                }
            ]
        },
        footer: {
            rights: "Tüm hakları saklıdır."
        }
    }
};
