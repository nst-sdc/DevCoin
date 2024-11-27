export interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  github: string;
  email?: string;
  adypuEmail?: string;
  linkedin?: string;
  devCoins: number;
  contributions: Contribution[];
}

export interface Contribution {
  id: string;
  type: 'PR' | 'COLLAB' | 'EVENT' | 'OTHER';
  description: string;
  coins: number;
  date: string;
  verified: boolean;
}

export const mockMembers: Member[] = [
  // Frontend Developers
  {
    id: 'f1',
    name: 'Siddharth Pareek',
    role: 'Frontend Developer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'siddharth-pareek',
    devCoins: 100,
    contributions: [],
  },
  {
    id: 'f2',
    name: 'NIHAL C',
    role: 'Frontend Developer',
    avatar: 'https://github.com/nst-sdc/Member/releases/download/m/nihal.jpg',
    github: 'NIhalChollampat',
    email: 'nihalchollampat@gmail.com',
    adypuEmail: 'nihal.c@adypu.edu.in',
    linkedin: 'https://www.linkedin.com/in/nihal-c-99704132b/',
    devCoins: 100,
    contributions: [],
  },
  {
    id: 'f3',
    name: 'Ayush Kumar Mandal',
    role: 'Frontend Developer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'ayush-mandal',
    devCoins: 250,
    contributions: [],
  },
  {
    id: 'f4',
    name: 'Neel',
    role: 'Frontend Developer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'neel3o115',
    email: 'neelarm.code@gmail.com',
    adypuEmail: 'neel.verma@adypu.edu.in',
    linkedin: 'https://linkedin.com/in/neel-verma-141844318/',
    devCoins: 250,
    contributions: [],
  },
  {
    id: 'f5',
    name: 'Nitya Jain',
    role: 'Frontend Developer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'nitya-jain',
    devCoins: 200,
    contributions: [],
  },
  {
    id: 'f6',
    name: 'Aditya Prakash',
    role: 'Frontend Developer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'aditya-prakash',
    devCoins: 100,
    contributions: [],
  },

  // Backend Developers
  {
    id: 'b1',
    name: 'Burra Karthikeya',
    role: 'Backend Developer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'burra-karthikeya',
    devCoins: 100,
    contributions: [],
  },
  {
    id: 'b2',
    name: 'Gunavanth Reddy',
    role: 'Backend Developer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'gunavanth-reddy',
    devCoins: 100,
    contributions: [],
  },
  {
    id: 'b3',
    name: 'Abhay Pratap Yadav',
    role: 'Backend Developer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'abhay-pratap',
    devCoins: 100,
    contributions: [],
  },
  {
    id: 'b4',
    name: 'Rahul Gupta',
    role: 'Backend Developer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'Rahulgupta7777',
    email: 'rahulgupta193246@gmail.com',
    adypuEmail: 'rahul.k@adypu.edu.in',
    linkedin: 'https://linkedin.com/in/rahul-gupta-992259326',
    devCoins: 100,
    contributions: [],
  },
  {
    id: 'b5',
    name: 'Arohi Jadhav',
    role: 'Backend Developer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'arohi-jadhav',
    devCoins: 200,
    contributions: [],
  },

  // DevOps Engineers
  {
    id: 'd1',
    name: 'Vivek Wagdare',
    role: 'DevOps Engineer',
    avatar: 'https://avatars.githubusercontent.com/u/92390419?v=4',
    github: 'AryanVBW',
    email: 'vivek.aryanvbw@gmail.com',
    adypuEmail: 'vivek.wagadare@adypu.edu.in',
    linkedin: 'https://www.linkedin.com/in/vivek-wagadare',
    devCoins: 800,
    contributions: [20],
  },
  {
    id: 'd2',
    name: 'Ayush Shukla',
    role: 'DevOps Engineer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'ayush-shukla',
    devCoins: 100,
    contributions: [],
  },
  {
    id: 'd3',
    name: 'B Sai Thrishul',
    role: 'DevOps Engineer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'sai-thrishul',
    devCoins: 100,
    contributions: [],
  },

  // Designers
  {
    id: 'des1',
    name: 'Riddhi',
    role: 'Designer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'riddhi',
    devCoins: 150,
    contributions: [],
  },
  {
    id: 'des2',
    name: 'Sakina',
    role: 'Designer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'sakina1303',
    email: 'sakena1303@gmail.com',
    adypuEmail: 'sakina.ahemad@adypu.edu.in',
    linkedin: 'https://linkedin.com/in/sakina-ahemad-8b1b3a1b0',
    devCoins: 200,
    contributions: [],
  },
  {
    id: 'des3',
    name: 'Ananya Gupta',
    role: 'Designer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'anya_xcode',
    email: 'ananynagupta@gmail.com',
    adypuEmail: 'ananya.gupta@adypu.edu.in',
    linkedin: 'https://linkedin.com/in/ananya-gupta-7235a5319',
    devCoins: 100,
    contributions: [],
  },
  {
    id: 'des4',
    name: 'Vipul',
    role: 'Designer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'codervipul775',
    email: 'ydvvipul2005@gmail.com',
    adypuEmail: 'vipul.k@adypu.edu.in',
    linkedin: 'https://linkedin.com/in/vipul-yadav-b0a82231a/',
    devCoins: 100,
    contributions: [],
  },

  // Mobile App Developers
  {
    id: 'm1',
    name: 'Tanubhav',
    role: 'Mobile App Developer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'tanubhav',
    devCoins: 100,
    contributions: [],
  },
  {
    id: 'm2',
    name: 'Chiranjeev',
    role: 'Mobile App Developer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'chiranjeev',
    devCoins: 100,
    contributions: [],
  },
  {
    id: 'm3',
    name: 'Kanishk Kumar Ranjan',
    role: 'Mobile App Developer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'kanishk-kumar',
    devCoins: 150,
    contributions: [],
  },
  {
    id: 'm4',
    name: 'Daksh Saini',
    role: 'Mobile App Developer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'daksh-saini',
    devCoins: 250,
    contributions: [],
  },

  // Volunteers
  {
    id: 'v1',
    name: 'Yash Mali',
    role: 'Volunteer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'yash-mali',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'v2',
    name: 'Arpit Sarang',
    role: 'Volunteer',
    avatar: 'https://github.com/nst-sdc/Member/releases/download/m/Arpit.jpg',
    github: 'arpit-sarang',
    devCoins: 280,
    contributions: [5],
  },
  {
    id: 'v3',
    name: 'Kirti Gautam',
    role: 'Volunteer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'kirti-gautam',
    devCoins: 100,
    contributions: [],
  },
  {
    id: 'v4',
    name: 'Birajit Saikia',
    role: 'Volunteer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'birajit-saikia',
    devCoins: 150,
    contributions: [],
  },
  {
    id: 'v5',
    name: 'Ayush Pandey',
    role: 'Volunteer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'ayush-pandey',
    devCoins: 250,
    contributions: [],
  },
  {
    id: 'v6',
    name: 'Aditya Raj Soni',
    role: 'Volunteer',
    avatar: 'https://github.com/nst-sdc/NIRMAN-submission/releases/download/v1/dorae.jpg',
    github: 'aditya-raj-soni',
    devCoins: 100,
    contributions: [],
  },
];