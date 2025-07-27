import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, useParams, useNavigate, useLocation } from 'react-router-dom';
import p5 from "p5";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import profilePic from './assets/73353C8F-540D-4FD1-8E81-BBA1B370E9B8_1_201_a.jpeg';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

const TECHS = [
  { name: "Python", level: 95, color: "#2563eb" }, // dark blue
  { name: "R", level: 75, color: "#276dc3" }, // R blue
  { name: "MATLAB", level: 60, color: "#be185d" }, // dark pink
  { name: "Git", level: 85, color: "#166534" }, // dark green
  { name: "SQL", level: 75, color: "#b59f3b" }, // dark gold
  { name: "Cloud", level: 90, color: "#374151" }, // dark gray for cloud
  { name: "ML/AI", level: 98, color: "#7c3aed" }, // purple for ML/AI
  { name: "Data Viz", level: 85, color: "#dc2626" }, // red for data visualization
  { name: "APIs", level: 85, color: "#059669" }, // emerald for APIs
  { name: "LaTeX", level: 70, color: "#92400e" }, // amber for LaTeX
];

const SKILLS_OVERVIEW = [
  { category: 'Programming Languages', tech: 'Python, R, SQL, MATLAB, C++' },
  { category: 'Data Science & ML', tech: 'Pandas, NumPy, Scikit-learn (GMM, RandomForest), Geopy, GeoPandas, fbprophet, Regression Analysis, Clustering, Neural Networks, NLP, Transformers' },
  { category: 'AI & LLMs', tech: 'Gemini (Vertex AI), DSpy, Langchain, LangGraph, OpenAI, RAG, Generative AI, Prompt Engineering' },
  { category: 'Databases & Cloud', tech: 'PostgreSQL, Firebase, AWS, Azure, GCP, Databricks, Spark, MLflow' },
  { category: 'Engineering & Simulation', tech: 'ANSYS, Minitab, Design of Experiments (Taguchi), Vibration Analysis, Statistical Analysis' },
  { category: 'Tools & Development', tech: 'Git, GitHub, Jupyter Notebooks, RStudio, LaTeX, Docker, Flask, OAuth, JSON, APIs' },
  { category: 'Data Visualization', tech: 'Matplotlib, RStudio Visualization, Interactive Dashboards, Statistical Plots' },
  { category: 'Domains & Applications', tech: 'Machine Learning, Data Analysis, Mechanical Engineering, Property Management, PDF Processing, Email Automation' },
];

const PROJECTS = [
  {
    slug: 'covid-taxi-nyc',
    title: 'Covid-19 Effects on Yellow Taxi in NYC',
    subtitle: 'NYC Borough Taxi Pickups/Dropoffs',
    description: `Analyzed the impact of Covid-19 restrictions on NYC yellow taxi usage by comparing data from 2018 and 2020, focusing on lockdown vs. less restricted months. Utilized ML models including 1D Gaussian Mixture Model and Random Forest Regression, along with Clustering. Evaluated model performance using MSE and MAE.`,
    tech: ['Python', 'Scikit-learn', 'Pandas', 'Jupyter Notebook'],
    links: [
      { label: 'View Code Repository', url: 'https://github.com/king-sules/Covid_Taxi' },
    ],
    category: 'Data Analysis',
  },
  {
    slug: 'housing-nuclear-thesis',
    title: 'Housing Prices vs. Nuclear Power Plants (Undergraduate Thesis)',
    subtitle: 'Map of Plymouth MA area',
    description: `Investigated house price variations in Plymouth, MA, based on distance from a nearby nuclear power plant, specifically examining effects post-Fukushima Daiichi event. Cleaned housing data and calculated distances using Geopy and GeoPandas. Created dummy variables and distance categories to control for factors in the analysis. Performed multiple regression analysis using R to determine correlations.`,
    tech: ['Python', 'R', 'Geopy', 'GeoPandas', 'Pandas'],
    links: [
      { label: 'View Code Repository', url: 'https://github.com/king-sules/Nuclear_Matrix_Data' },
      { label: 'Read Thesis Paper', url: 'https://github.com/king-sules/Nuclear_Matrix_Data/blob/master/Final%20Thesis.pdf' },
    ],
    category: 'Data Analysis',
  },
  {
    slug: 'covid-breakout-analysis',
    title: 'Covid-19 Breakout Analysis',
    subtitle: '',
    description: `Tracked and analyzed the initial Covid-19 outbreak (Dec 2019 - May 2020) using data from Johns Hopkins University. Focused on identifying the most affected countries during the early phase. Visualized the spread and impact using RStudio.`,
    tech: ['R', 'RStudio', 'Data Visualization'],
    links: [
      { label: 'View Code Repository', url: 'https://github.com/king-sules/Covid' },
    ],
    category: 'Data Analysis',
  },
  {
    slug: 'taxi-vs-uber-fhv',
    title: 'Taxi vs. Uber/FHV Analysis in NYC',
    subtitle: '',
    description: `Analyzed the impact of the Aug 2018 TLC policy change on yellow cab vs. For-Hire Vehicle (Uber/Lyft) ride volume in NYC. Queried ride data using PostgreSQL. Visualized daily and monthly ride trends using Python. Predicted future ride trends for both taxi and FHV sectors using Facebook's fbprophet library.`,
    tech: ['Python', 'SQL (PostgreSQL)', 'Pandas', 'fbprophet'],
    links: [
      { label: 'View Code Repository', url: 'https://github.com/king-sules/Taxi' },
    ],
    category: 'Data Analysis',
  },
  {
    slug: 'airplane-wing-vibration',
    title: 'Airplane Wing Vibration Analysis',
    subtitle: 'ANSYS Vibration Mode Shape',
    description: `Analyzed vibration effects on a sample airplane wing modeled with multiple degrees of freedom. Determined vibration modes using a custom MATLAB code. Visualized results using ANSYS software. Compiled findings into a comprehensive report using LaTeX.`,
    tech: ['MATLAB', 'ANSYS', 'LaTeX'],
    links: [
      { label: 'View MATLAB Code', url: 'https://github.com/king-sules/Vibrations' },
      { label: 'Read Full Report (LaTeX PDF)', url: 'https://github.com/king-sules/Vibrations/blob/main/Vibration_Project%20(2).pdf' },
    ],
    category: 'Mechanical Engineering',
  },
  {
    slug: 'tire-wear-optimization',
    title: 'Design for Manufacturability (Tire Wear Optimization)',
    subtitle: '',
    description: `Applied the Taguchi method (Design of Experiments) to optimize tire design parameters (slip angle, tension strength, friction) for improved manufacturability and reduced wear. Analyzed parameter effects and determined optimal settings using Minitab. Documented the methodology and results in a formal report.`,
    tech: ['Minitab', 'Design of Experiments (Taguchi)', 'LaTeX'],
    links: [],
    category: 'Mechanical Engineering',
  },
  {
    slug: 'dspy-extract',
    title: 'Dspy_extract',
    subtitle: 'PDF Entity Extraction with Gemini',
    description: `This project utilizes the DSpy library for prompt optimization to enhance PDF entity extraction capabilities. The system leverages Google's Gemini model to improve accuracy and efficiency in extracting structured data from PDF documents.`,
    tech: ['Python', 'DSpy', 'Gemini', 'Pydantic', 'PDF Processing'],
    links: [
      { label: 'Read Medium Article', url: 'https://medium.com/@asulemanada/supercharging-pdf-entity-extraction-using-gemini-dspy-and-pydantic-796f27d8aeeb' },
    ],
    category: 'GenAI',
  },
  {
    slug: 'ai-email-agent',
    title: 'AI Email Agent',
    subtitle: 'Property Management Automation',
    description: `An AI-powered email agent that reads emails from Gmail inbox, generates responses using Google's Gemini (Vertex AI), and sends/drafts replies automatically. Specifically designed as a property agent answering emails from potential tenants. Built from scratch to showcase custom AI automation capabilities.`,
    tech: ['Python', 'Firebase', 'Gemini (Vertex AI)', 'Gmail API', 'Langchain', 'OAuth', 'JSON'],
    links: [ 
      {label: 'View Code Repository', url: 'https://github.com/king-sules/property_agent'}],
    category: 'GenAI',
  },
];

function NeuralNetworkBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    let myP5;
    const sketch = (p) => {
      let nodes = [];
      let edges = [];
      const GRID_ROWS = 6;
      const GRID_COLS = 10;
      const NODE_COUNT = GRID_ROWS * GRID_COLS;
      const EDGE_COUNT = 60;
      let width, height, xSpacing, ySpacing;
      p.setup = () => {
        width = p.windowWidth;
        height = p.windowHeight;
        p.createCanvas(width, height).parent(canvasRef.current);
        nodes = [];
        xSpacing = width / (GRID_COLS + 1);
        ySpacing = height / (GRID_ROWS + 1);
        for (let row = 0; row < GRID_ROWS; row++) {
          for (let col = 0; col < GRID_COLS; col++) {
            nodes.push({
              baseX: (col + 1) * xSpacing,
              baseY: (row + 1) * ySpacing,
              x: (col + 1) * xSpacing,
              y: (row + 1) * ySpacing,
              r: 10 + p.random(4),
              phase: p.random(p.TWO_PI),
            });
          }
        }
        edges = [];
        for (let i = 0; i < EDGE_COUNT; i++) {
          let a = p.floor(p.random(NODE_COUNT));
          let b = p.floor(p.random(NODE_COUNT));
          if (a !== b) edges.push([a, b]);
        }
      };
      p.draw = () => {
        p.clear();
        nodes.forEach((node, i) => {
          const t = p.millis() * 0.001;
          node.x = node.baseX + p.sin(t + node.phase) * 10;
          node.y = node.baseY + p.cos(t + node.phase) * 10;
        });
        p.stroke(120, 120, 255, 60);
        p.strokeWeight(1.5);
        edges.forEach(([a, b]) => {
          p.line(nodes[a].x, nodes[a].y, nodes[b].x, nodes[b].y);
        });
        nodes.forEach((node) => {
          p.noStroke();
          p.fill(180, 200, 255, 200);
          p.ellipse(node.x, node.y, node.r * 2);
        });
      };
      p.windowResized = () => {
        width = p.windowWidth;
        height = p.windowHeight;
        p.resizeCanvas(width, height);
        xSpacing = width / (GRID_COLS + 1);
        ySpacing = height / (GRID_ROWS + 1);
        nodes.forEach((node, idx) => {
          const row = Math.floor(idx / GRID_COLS);
          const col = idx % GRID_COLS;
          node.baseX = (col + 1) * xSpacing;
          node.baseY = (row + 1) * ySpacing;
        });
      };
    };
    myP5 = new p5(sketch);
    return () => {
      myP5.remove();
    };
  }, []);
  return <div ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" />;
}

function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative z-20">
      <h1 className="text-5xl font-extrabold text-white mb-6 drop-shadow-lg text-center">Welcome to Suleman's Website</h1>
      <p className="text-xl text-white mb-8 text-center">You can navigate to the projects page to see my work, or the skills page to see my coding proficiencies.</p>
    </div>
  );
}

function TechStack() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full pt-16 mt-24">
      <div style={{ height: 150 }} />
      <h3 className="text-2xl font-bold text-white mt-8 mb-4 text-center">Coding Proficiencies</h3>
      <Box display="flex" alignItems="flex-end" justifyContent="center" gap={4} width="100%" maxWidth={800} height={180} bgcolor="rgba(255,255,255,0.05)" borderRadius={4} p={4} boxShadow={6} mb={6}>
        {TECHS.map((tech) => (
          <Box key={tech.name} display="flex" flexDirection="column" alignItems="center" width={56}>
            <Box mb={1} color="#93c5fd" fontWeight={700} fontSize={14}>{tech.level}%</Box>
            <Box
              width={40}
              height={tech.level * 1.2}
              minHeight={8}
              borderRadius={2}
              sx={{
                background: tech.color,
                transition: 'height 0.5s',
              }}
              title={tech.name}
            />
            <Box mt={1.5} color="#fff" fontWeight={600} fontSize={12} textAlign="center">{tech.name}</Box>
          </Box>
        ))}
      </Box>
      <h3 className="text-2xl font-bold text-white mt-8 mb-4 text-center">Skills Overview</h3>
      <TableContainer component={Paper} sx={{ maxWidth: 900, background: 'rgba(30,41,59,0.95)', borderRadius: 3, boxShadow: 6, mb: 6 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#60a5fa', fontWeight: 700, fontSize: 18, background: 'rgba(30,41,59,0.95)' }}>Category</TableCell>
              <TableCell sx={{ color: '#60a5fa', fontWeight: 700, fontSize: 18, background: 'rgba(30,41,59,0.95)' }}>Technologies & Concepts</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {SKILLS_OVERVIEW.map((row) => (
              <TableRow key={row.category}>
                <TableCell sx={{ color: '#fff', fontWeight: 600, fontSize: 16, borderBottom: '1px solid #334155' }}>{row.category}</TableCell>
                <TableCell sx={{ color: '#cbd5e1', fontSize: 15, borderBottom: '1px solid #334155' }}>{row.tech}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

function Projects() {
  const categories = Array.from(new Set(PROJECTS.map(p => p.category)));
  
  // Sort categories to put GenAI first
  const sortedCategories = categories.sort((a, b) => {
    if (a.includes('GenAI')) return -1;
    if (b.includes('GenAI')) return 1;
    return 0;
  });
  
  return (
    <div className="w-full min-h-screen overflow-y-auto" style={{ marginTop: '220px', paddingLeft: '200px', paddingRight: '16px', paddingBottom: '200px' }}>
      <div className="max-w-6xl mx-auto" style={{ marginTop: '100px' }}>
        {sortedCategories.map(category => (
          <div key={category} className="w-full mb-12">
            <h3 className="text-2xl font-bold text-blue-200 mb-4 pl-2">
              {category.replace(/^[^a-zA-Z]+/, '')}
            </h3>
            <div className="w-full overflow-x-auto">
              <div className="flex flex-nowrap gap-4 pb-4" style={{ minHeight: 340 }}>
                {PROJECTS.filter(p => p.category === category).map((project) => (
                  <div key={project.slug} className="flex-shrink-0 w-[340px]">
                    <Card
                      sx={{
                        width: '100%',
                        bgcolor: 'rgba(30,41,59,0.95)',
                        color: '#fff',
                        borderRadius: 3,
                        boxShadow: 6
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ color: '#60a5fa', fontWeight: 700, mb: 1 }}>
                          {project.title}
                        </Typography>
                        {project.subtitle && (
                          <Typography variant="subtitle2" sx={{ color: '#cbd5e1', mb: 2 }}>
                            {project.subtitle}
                          </Typography>
                        )}
                        <Typography variant="body2" sx={{ color: '#e0e7ef', mb: 2 }}>
                          {project.description.slice(0, 120)}...
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                          {project.tech.map((t) => (
                            <Box
                              key={t}
                              px={1.5}
                              py={0.5}
                              bgcolor="#1e293b"
                              color="#93c5fd"
                              borderRadius={2}
                              fontSize={12}
                              fontWeight={600}
                            >
                              {t}
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          component={RouterLink}
                          to={`/projects/${project.slug}`}
                          size="small"
                          sx={{ color: '#60a5fa', fontWeight: 700 }}
                        >
                          View Details
                        </Button>
                        {project.links && project.links.length > 0 && project.links.map((link, index) => (
                          <Button
                            key={index}
                            size="small"
                            onClick={() => window.open(link.url, '_blank')}
                            sx={{ color: '#60a5fa', fontWeight: 700 }}
                          >
                            {link.label}
                          </Button>
                        ))}
                      </CardActions>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectDetail() {
  const { slug } = useParams();
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return <div className="text-white text-2xl mt-32">Project not found.</div>;
  return (
    <div className="flex flex-col items-center justify-center w-full h-full pt-16 mt-24">
      <div style={{ height: 90 }} />
      <Box maxWidth={700} bgcolor="rgba(30,41,59,0.95)" borderRadius={3} boxShadow={6} p={5}>
        <Typography variant="h4" sx={{ color: '#60a5fa', fontWeight: 700, mb: 2 }}>{project.title}</Typography>
        {project.subtitle && <Typography variant="subtitle1" sx={{ color: '#cbd5e1', mb: 2 }}>{project.subtitle}</Typography>}
        <Typography variant="body1" sx={{ color: '#e0e7ef', mb: 3 }}>{project.description}</Typography>
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {project.tech.map((t) => (
            <Box key={t} px={1.5} py={0.5} bgcolor="#1e293b" color="#93c5fd" borderRadius={2} fontSize={13} fontWeight={600}>{t}</Box>
          ))}
        </Box>
        {project.links && project.links.length > 0 && (
          <Box mb={2} display="flex" flexWrap="wrap" gap={2}>
            {project.links.map((link, idx) => (
              <Button key={idx} href={link.url} target="_blank" rel="noopener" variant="outlined" sx={{ color: '#60a5fa', borderColor: '#60a5fa', fontWeight: 700 }}>
                {link.label}
              </Button>
            ))}
          </Box>
        )}
        {project.category && <Box mt={2} color="#fbbf24" fontWeight={700} fontSize={16}>{project.category}</Box>}
        <Button component={RouterLink} to="/projects" sx={{ color: '#60a5fa', fontWeight: 700, mt: 2 }}>Back to Projects</Button>
      </Box>
    </div>
  );
}

function Resume() {
  const categories = Array.from(new Set(PROJECTS.map(p => p.category)));
  return (
    <div className="w-full min-h-screen" style={{ marginTop: '120px', paddingLeft: '140px', paddingRight: '16px', paddingBottom: '80px' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 drop-shadow-lg text-center">Projects</h2>
        {categories.map(category => (
          <div key={category} className="w-full mb-12">
            <h3 className="text-2xl font-bold text-blue-200 mb-4 pl-2">
              {category.replace(/^[^a-zA-Z]+/, '')}
            </h3>
            <div className="w-full overflow-x-auto">
              <div className="flex flex-nowrap gap-4 pb-4" style={{ minHeight: 340 }}>
                {PROJECTS.filter(p => p.category === category).map((project) => (
                  <div key={project.slug} className="flex-shrink-0 w-[340px]">
                    <Card
                      sx={{
                        width: '100%',
                        bgcolor: 'rgba(30,41,59,0.95)',
                        color: '#fff',
                        borderRadius: 3,
                        boxShadow: 6
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ color: '#60a5fa', fontWeight: 700, mb: 1 }}>
                          {project.title}
                        </Typography>
                        {project.subtitle && (
                          <Typography variant="subtitle2" sx={{ color: '#cbd5e1', mb: 2 }}>
                            {project.subtitle}
                          </Typography>
                        )}
                        <Typography variant="body2" sx={{ color: '#e0e7ef', mb: 2 }}>
                          {project.description.slice(0, 120)}...
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                          {project.tech.map((t) => (
                            <Box
                              key={t}
                              px={1.5}
                              py={0.5}
                              bgcolor="#1e293b"
                              color="#93c5fd"
                              borderRadius={2}
                              fontSize={12}
                              fontWeight={600}
                            >
                              {t}
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          component={RouterLink}
                          to={`/projects/${project.slug}`}
                          size="small"
                          sx={{ color: '#60a5fa', fontWeight: 700 }}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Social() {
  const [expandedCards, setExpandedCards] = useState({});

  const socialPlatforms = [
    {
      name: "Instagram",
      description: "Follow my daily life, and my very much amataur modeling and fashion sense",
      color: "#E4405F",
      url: "https://instagram.com/your-username"
    },
    {
      name: "Goodreads",
      description: "Check out my reading list and book reviews. I enjoy reading non-fiction and social science books.",
      color: "#372213",
      url: "https://www.goodreads.com/user/show/188247574-sules-a"
    },
    {
      name: "Medium Blog",
      description: "Read my thoughts on AI, data science, and technology. I write about my experiences, share insights from my projects, and discuss the latest trends in the field.",
      color: "#00AB6C",
      url: "https://medium.com/@your-usernamehttps://medium.com/@asulemanada"
    }
  ];

  const toggleExpanded = (index) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="w-full min-h-screen overflow-y-auto" style={{ marginTop: '220px', paddingLeft: '140px', paddingRight: '140px', paddingBottom: '100px' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 drop-shadow-lg text-center">Social Media</h2>
        
        <div className="flex justify-center">
          <div className="flex gap-4">
            {socialPlatforms.map((platform, index) => (
              <div key={index} className="w-[340px]">
                <Card sx={{ width: '100%', bgcolor: 'rgba(30,41,59,0.95)', color: '#fff', borderRadius: 3, boxShadow: 6 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#60a5fa', fontWeight: 700, mb: 1 }}>
                      {platform.name}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: '#cbd5e1', mb: 2 }}>
                      {platform.icon}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#e0e7ef', mb: 2 }}>
                      {expandedCards[index] ? platform.description : platform.description.slice(0, 120) + '...'}
                    </Typography>
                    <Button
                      onClick={() => toggleExpanded(index)}
                      size="small"
                      sx={{ 
                        color: '#60a5fa', 
                        fontWeight: 700, 
                        p: 0, 
                        minWidth: 'auto',
                        textTransform: 'none',
                        fontSize: '0.875rem'
                      }}
                    >
                      {expandedCards[index] ? 'Show Less' : 'Read More'}
                    </Button>
                  </CardContent>
                  <CardActions>
                    <Button
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      sx={{ color: '#60a5fa', fontWeight: 700 }}
                    >
                      Visit {platform.name}
                    </Button>
                  </CardActions>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const NAV_TABS = [
  { label: "Home", path: "/" },
  { label: "Projects", path: "/projects" },
  { label: "Tech Stack", path: "/tech-stack" },
  { label: "Resume", path: "/resume" },
  { label: "Social", path: "/social" },
  { label: "GitHub", path: "/github" },
  { label: "About", path: "/about" },
];

function NavTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleTabChange = (_, newValue) => {
    const selectedTab = NAV_TABS[newValue];
    
    if (selectedTab.path === "/resume") {
      // Open PDF in new tab
      window.open('/sules_site/Sules_Resume.pdf', '_blank');
      return; // Don't navigate, just open PDF
    } else if (selectedTab.path === "/github") {
      // Open GitHub website in new tab
      window.open('https://github.com/king-sules', '_blank');
      return; // Don't navigate, just open GitHub
    } else {
      navigate(selectedTab.path);
    }
  };
  
  // Find the current tab index based on the current path
  const currentTab = NAV_TABS.findIndex(tab => {
    if (tab.path === "/projects") {
      // For projects tab, check if path starts with /projects (includes project detail pages)
      return location.pathname.startsWith("/projects");
    }
    if (tab.path === "/resume" || tab.path === "/github") {
      // For resume and github tabs, don't highlight them since they open external content
      return false;
    }
    return tab.path === location.pathname;
  });
  
  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'fixed', top: 0, left: 0, zIndex: 20, bgcolor: 'transparent', pt: 3, pl: 5 }}>
      <Tabs
        value={currentTab === -1 ? 0 : currentTab}
        onChange={handleTabChange}
        variant="standard"
        TabIndicatorProps={{ style: { background: 'linear-gradient(to right, #60a5fa, #3b82f6, #1e40af)' } }}
        sx={{
          gap: 3,
          '.MuiTab-root': {
            minWidth: 120,
            minHeight: 56,
            mx: 2,
            px: 4,
            py: 1.5,
            borderRadius: 3,
            bgcolor: 'rgba(30,41,59,0.85)',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.1rem',
            boxShadow: 3,
            border: '2px solid #cbd5e1',
            transition: 'all 0.2s',
            '&.Mui-selected': {
              color: 'transparent',
              background: 'linear-gradient(to right, #60a5fa, #3b82f6, #1e40af)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              borderColor: '#3b82f6',
              boxShadow: 6,
            },
            '&:hover': {
              bgcolor: 'rgba(30,41,59,1)',
              borderColor: '#3b82f6',
            },
          },
        }}
      >
        {NAV_TABS.map(tab => (
          <Tab key={tab.path} label={tab.label} />
        ))}
      </Tabs>
    </Box>
  );
}

function AppContent() {
  const location = useLocation();
  
  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-black overflow-hidden">
      {/* Profile Picture Top Left */}
      <img
        src={profilePic}
        alt="Profile"
        className="fixed top-4 left-4 w-32 h-32 rounded-full object-cover border-2 border-gray-900 shadow-lg z-30 overflow-hidden"
        style={{ maxWidth: 128, maxHeight: 128, background: '#222' }}
      />
      {/* Show neural network only on Home page */}
      {location.pathname === "/" && <NeuralNetworkBackground />}
      {/* Material UI Tabs Navigation */}
      <NavTabs />
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tech-stack" element={<TechStack />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/social" element={<Social />} />
          {/* Placeholder routes for other tabs */}
          <Route path="/about" element={
            <div className="w-full min-h-screen overflow-y-auto" style={{ marginTop: '220px', paddingBottom: '100px' }}>
              <div className="max-w-4xl mx-auto" style={{ marginLeft: '140px', marginRight: '140px' }}>
                
                <Card sx={{ bgcolor: 'rgba(30,41,59,0.95)', color: '#fff', borderRadius: 3, boxShadow: 6, mt: 4 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ color: '#60a5fa', fontWeight: 700, mb: 3, textAlign: 'center' }}>
                      Hello! Thanks for checking out my page!
                    </Typography>
                    
                    <Typography variant="body1" sx={{ color: '#e0e7ef', mb: 3, lineHeight: 1.8, fontSize: '1.1rem' }}>
                      My name is <span style={{ color: '#93c5fd', fontWeight: 600 }}>Suleman</span> and currently I work as a data consultant with the federal government. I'm originally from New York City, but I currently reside in Washington D.C. My background is in physics and engineering but I like to think of myself as a jack of all trades type of guy (hence why I'm a consultant).
                    </Typography>
                    
                    <Typography variant="body1" sx={{ color: '#e0e7ef', mb: 3, lineHeight: 1.8, fontSize: '1.1rem' }}>
                      I got interested in AI accidentally in my undergrad years in CUNY Queens College, when I was working on my economics thesis. I was using linear regression to solve a complex problem, and, I later realized that the model that I created was technically a machine learning model. All the classes I excelled at were the building blocks of AI…linear algebra, statistics, and calculus to name a few. It wasn't until my masters that I was able to sew it all up and found my niche.
                    </Typography>
                    
                    <Typography variant="body1" sx={{ color: '#e0e7ef', mb: 3, lineHeight: 1.8, fontSize: '1.1rem' }}>
                      I am a big fan of creating stories. I want to write a book one day! That's why I love being in this industry. Finding insights, within otherwise junk data, is something I take pride in doing. I believe with the right technology anyone can find data, but translating it and presenting it in a digestible manner, I excel at. Lately, I have been engaging in utilizing LLM's and creating pipelines to turbocharge workflows and deliver value to my clients at the feds. I enjoy the fast pace in the ever-growing landscape of AI, and I am always trying to stay up to date with my skillset.
                    </Typography>
                    
                    <Typography variant="body1" sx={{ color: '#e0e7ef', mb: 3, lineHeight: 1.8, fontSize: '1.1rem' }}>
                      In my free time, I like to engage in <span style={{ color: '#93c5fd', fontWeight: 600 }}>weightlifting</span>, <span style={{ color: '#93c5fd', fontWeight: 600 }}>reading</span>, <span style={{ color: '#93c5fd', fontWeight: 600 }}>biking</span>, <span style={{ color: '#93c5fd', fontWeight: 600 }}>fishing</span> and <span style={{ color: '#93c5fd', fontWeight: 600 }}>volunteering</span>. I try to keep myself busy but I also love just relaxing and watching a good movie. If you would like to connect or want to discuss my book of the month please feel free to reach out!
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router basename="/sules_site">
      <AppContent />
    </Router>
  );
}

export default App;
