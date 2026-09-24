export interface SkillItem {
  name: string
  isGlobal: boolean
  plugin: string | null
  description: string
}

export const DEFAULT_SKILLS: SkillItem[] = [
  {
    name: 'agy-customizations',
    isGlobal: true,
    plugin: null,
    description:
      'Comprehensive guide and reference for the Antigravity Customization System. Use to explain how customizations work, their loading priority, discovery mechanisms, and to guide the creation of skills, rules, plugins, hooks, and MCP servers.'
  },
  {
    name: 'alphafold-database-fetch-and-analyze',
    isGlobal: true,
    plugin: 'science',
    description:
      'Retrieve and analyze AlphaFold predicted structures for a protein. Use when the user provides a specific UniProt Accession ID and wants structural confidence metrics (pLDDT), domain boundary analysis, or disorder assessment.'
  },
  {
    name: 'alphagenome-atlas-website-links',
    isGlobal: true,
    plugin: 'science',
    description:
      'Constructs deep-links and URLs for the AlphaGenome Atlas website. Supports generating single-variant exploration links (1-based chr:pos:ref>alt), genomic locus views, candidate summary tables, and AlphaGenome reference vs. alternate predictions.'
  },
  {
    name: 'alphagenome-single-variant-analysis',
    isGlobal: true,
    plugin: 'science',
    description:
      'Analyzes genetic variant effects on gene expression (RNA-seq), chromatin accessibility (DNASE), histone marks (ChIP), and transcription factors using the AlphaGenome API.'
  },
  {
    name: 'alphagenome-variant-impact-score',
    isGlobal: true,
    plugin: 'science',
    description:
      'Score, annotate, and analyze the functional impact of genetic variants using AlphaGenome Variant Impact (AVI) scores.'
  },
  {
    name: 'android-cli',
    isGlobal: true,
    plugin: 'android-cli-plugin',
    description:
      'Provides instructions for installing and using the android CLI. Helps create Android projects, run apps, manage virtual devices, and inspect UI.'
  },
  {
    name: 'antigravity-guide',
    isGlobal: true,
    plugin: null,
    description:
      'Comprehensive guide, quick reference, and sitemap for Google Antigravity (AGY), including CLI, IDE, Python SDK, slash commands, keybindings, and customizations.'
  },
  {
    name: 'chembl-database',
    isGlobal: true,
    plugin: 'science',
    description:
      'Query the ChEMBL database for bioactive molecules, drug targets, bioactivity data, approved drugs, and chemical structures.'
  },
  {
    name: 'clinical-trials-database',
    isGlobal: true,
    plugin: 'science',
    description:
      'Query ClinicalTrials.gov via APIv2 for conditions, drugs, locations, status, phases, and NCT ID details.'
  },
  {
    name: 'clinvar-database',
    isGlobal: true,
    plugin: 'science',
    description:
      'Clinical significance and pathogenicity classifications (Pathogenic, Benign, VUS) for human genomic variants.'
  },
  {
    name: 'credentials',
    isGlobal: true,
    plugin: 'science',
    description:
      'Instructions for handling API keys and credentials safely, verifying presence, and prompting user safely.'
  },
  {
    name: 'dbsnp-database',
    isGlobal: true,
    plugin: 'science',
    description:
      'Look up, map, and search short genetic variants in NCBI dbSNP database (rsIDs, genomic coordinates, HGVS).'
  },
  {
    name: 'embl-ebi-ols',
    isGlobal: true,
    plugin: 'science',
    description:
      'Query and search EMBL-EBI Ontology Lookup Service (OLS) across 250+ biomedical ontologies.'
  },
  {
    name: 'encode-ccres-database',
    isGlobal: true,
    plugin: 'science',
    description:
      'Query the ENCODE Registry of cis-Regulatory Elements (cCREs) via SCREEN GraphQL API and ENCODE Portal.'
  },
  {
    name: 'ensembl-database',
    isGlobal: true,
    plugin: 'science',
    description:
      'Resolve gene, transcript, and protein IDs, fetch genomic sequences, and get variant effect predictions.'
  },
  {
    name: 'foldseek-structural-search',
    isGlobal: true,
    plugin: 'science',
    description:
      'Performs 3D structural searches of proteins against PDB, AlphaFold, and CATH databases using Foldseek.'
  },
  {
    name: 'generative_ui',
    isGlobal: true,
    plugin: null,
    description:
      'Render rich interactive HTML widgets, diagrams, charts, and standalone generative UI artifacts.'
  },
  {
    name: 'gnomad-database',
    isGlobal: true,
    plugin: 'science',
    description:
      'Query the Genome Aggregation Database (gnomAD) for allele frequency and gene constraint metrics.'
  },
  {
    name: 'gtex-database',
    isGlobal: true,
    plugin: 'science',
    description:
      'Retrieve quantitative RNA expression data and variant eQTL information from the GTEx Project.'
  },
  {
    name: 'human-protein-atlas-database',
    isGlobal: true,
    plugin: 'science',
    description:
      'Retrieve protein expression and spatial localisation data from the Human Protein Atlas (HPA).'
  },
  {
    name: 'interpro-database',
    isGlobal: true,
    plugin: 'science',
    description:
      'Identify protein domains, families, functional sites, and domain architectures across 14 databases.'
  },
  {
    name: 'jaspar-database',
    isGlobal: true,
    plugin: 'science',
    description:
      'Query the JASPAR database for Transcription Factor (TF) binding profiles and position frequency matrices.'
  },
  {
    name: 'literature-search-arxiv',
    isGlobal: true,
    plugin: 'science',
    description:
      'Search for scientific papers, preprints, and publications on arXiv with metadata and PDF download.'
  },
  {
    name: 'literature-search-biorxiv',
    isGlobal: true,
    plugin: 'science',
    description:
      'Browse, filter, and download life sciences and medical preprints from bioRxiv and medRxiv.'
  },
  {
    name: 'literature-search-europepmc',
    isGlobal: true,
    plugin: 'science',
    description:
      'Search Europe PMC for scientific literature, citations, and open-access full text articles.'
  },
  {
    name: 'literature-search-openalex',
    isGlobal: true,
    plugin: 'science',
    description:
      'Query OpenAlex scholarly database for research papers, authors, citations, institutions, and topics.'
  },
  {
    name: 'migrate-workflows',
    isGlobal: true,
    plugin: null,
    description:
      'Automatically migrate legacy workflows to modern skills across global and workspace configurations.'
  },
  {
    name: 'ncbi-sequence-fetch',
    isGlobal: true,
    plugin: 'science',
    description:
      'Retrieve protein and nucleotide sequences from NCBI databases using E-utilities and accession lookups.'
  },
  {
    name: 'openfda-database',
    isGlobal: true,
    plugin: 'science',
    description:
      'Query openFDA API for drug adverse events, recalls, labeling, approvals, and medical device clearances.'
  },
  {
    name: 'opentargets-database',
    isGlobal: true,
    plugin: 'science',
    description:
      'Query Open Targets Platform for target-disease associations, drug target discovery, and genomics.'
  },
  {
    name: 'pdb-database',
    isGlobal: true,
    plugin: 'science',
    description:
      'Search and download experimentally determined 3D biomolecular structures and metadata from PDB.'
  },
  {
    name: 'predictingthepast',
    isGlobal: true,
    plugin: 'science',
    description:
      'Ancient text restoration, attribution, dating, and contextualization via Aeneas and Ithaca.'
  },
  {
    name: 'protein-sequence-msa',
    isGlobal: true,
    plugin: 'science',
    description:
      'Multiple sequence alignment of proteins with EBI Clustal Omega to assess domain conservation.'
  },
  {
    name: 'protein-sequence-similarity-search',
    isGlobal: true,
    plugin: 'science',
    description:
      'Search homologous protein sequences using MMseqs2 (fast) or BLAST (comprehensive fallback).'
  },
  {
    name: 'pubchem-database',
    isGlobal: true,
    plugin: 'science',
    description:
      'Query PubChem database by CID, SMILES, and chemical name for properties and bioactivity.'
  },
  {
    name: 'pubmed-database',
    isGlobal: true,
    plugin: 'science',
    description:
      'Search PubMed literature and link citations to biological databases (Gene, Protein, PubChem).'
  },
  {
    name: 'pymol',
    isGlobal: true,
    plugin: 'science',
    description:
      'Visualize, analyze, and render 3D protein and molecular structures using PyMOL.'
  },
  {
    name: 'quickgo-database',
    isGlobal: true,
    plugin: 'science',
    description:
      'Query QuickGO and Evidence & Conclusion Ontology REST API for Gene Ontology terms and mappings.'
  },
  {
    name: 'reactome-database',
    isGlobal: true,
    plugin: 'science',
    description:
      'Query Reactome database for biological pathway analysis, reactions, and gene list enrichment.'
  },
  {
    name: 'scienceskillscommon',
    isGlobal: true,
    plugin: 'science',
    description:
      'Shared Python utilities and resilient HTTP client for Science Skills plugin.'
  },
  {
    name: 'string-database',
    isGlobal: true,
    plugin: 'science',
    description:
      'Query the STRING database for protein-protein interactions (PPIs) and functional enrichment.'
  },
  {
    name: 'ucsc-conservation-and-tfbs',
    isGlobal: true,
    plugin: 'science',
    description:
      'Fetch evolutionary conservation scores (phyloP, phastCons) and transcription factor binding sites.'
  },
  {
    name: 'unibind-database',
    isGlobal: true,
    plugin: 'science',
    description:
      'Direct TF-DNA interaction datasets and validated transcription factor binding sites.'
  },
  {
    name: 'uniprot-database',
    isGlobal: true,
    plugin: 'science',
    description:
      'Access protein metadata, functions, taxonomy, and sequences across UniProtKB and UniRef.'
  },
  {
    name: 'uv',
    isGlobal: true,
    plugin: 'science',
    description:
      'Checks whether the uv Python package manager is installed and installs it if missing. Ensures uv is on PATH. Use when another skill requires uv as a prerequisite.'
  },
  {
    name: 'workflow-skill-creator',
    isGlobal: true,
    plugin: 'science',
    description:
      'Distills a completed user workflow or interaction into a reusable agent skill. Use when the user asks to turn their workflow, interaction, or multi-step process into a skill, or when they say "make this a skill", "create a skill from what we just did", "package this workflow" or similar.'
  }
]
