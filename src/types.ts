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
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    github: 'siddharth-pareek',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'f2',
    name: 'NIHAL C',
    role: 'Frontend Developer',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400',
    github: 'NIhalChollampat',
    email: 'nihalchollampat@gmail.com',
    adypuEmail: 'nihal.c@adypu.edu.in',
    linkedin: 'https://www.linkedin.com/in/nihal-c-99704132b/',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'f3',
    name: 'Ayush Kumar Mandal',
    role: 'Frontend Developer',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400',
    github: 'ayush-mandal',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'f4',
    name: 'Neel',
    role: 'Frontend Developer',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
    github: 'neel3o115',
    email: 'neelarm.code@gmail.com',
    adypuEmail: 'neel.verma@adypu.edu.in',
    linkedin: 'https://linkedin.com/in/neel-verma-141844318/',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'f5',
    name: 'Nitya Jain',
    role: 'Frontend Developer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    github: 'nitya-jain',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'f6',
    name: 'Aditya Prakash',
    role: 'Frontend Developer',
    avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=400',
    github: 'aditya-prakash',
    devCoins: 0,
    contributions: [],
  },

  // Backend Developers
  {
    id: 'b1',
    name: 'Burra Karthikeya',
    role: 'Backend Developer',
    avatar: 'https://images.unsplash.com/photo-1640951613773-54706e06851d?w=400',
    github: 'burra-karthikeya',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'b2',
    name: 'Gunavanth Reddy',
    role: 'Backend Developer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    github: 'gunavanth-reddy',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'b3',
    name: 'Abhay Pratap Yadav',
    role: 'Backend Developer',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400',
    github: 'abhay-pratap',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'b4',
    name: 'Rahul Gupta',
    role: 'Backend Developer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    github: 'Rahulgupta7777',
    email: 'rahulgupta193246@gmail.com',
    adypuEmail: 'rahul.k@adypu.edu.in',
    linkedin: 'https://linkedin.com/in/rahul-gupta-992259326',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'b5',
    name: 'Arohi Jadhav',
    role: 'Backend Developer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    github: 'arohi-jadhav',
    devCoins: 0,
    contributions: [],
  },

  // DevOps Engineers
  {
    id: 'd1',
    name: 'Vivek Wagdare',
    role: 'DevOps Engineer',
    avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=400',
    github: 'vivek-wagdare',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'd2',
    name: 'Ayush Shukla',
    role: 'DevOps Engineer',
    avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=400',
    github: 'ayush-shukla',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'd3',
    name: 'B Sai Thrishul',
    role: 'DevOps Engineer',
    avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=400',
    github: 'sai-thrishul',
    devCoins: 0,
    contributions: [],
  },

  // Designers
  {
    id: 'des1',
    name: 'Riddhi',
    role: 'Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    github: 'riddhi',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'des2',
    name: 'Sakina',
    role: 'Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    github: 'sakina1303',
    email: 'sakena1303@gmail.com',
    adypuEmail: 'sakina.ahemad@adypu.edu.in',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'des3',
    name: 'Ananya Gupta',
    role: 'Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    github: 'anya_xcode',
    email: 'ananynagupta@gmail.com',
    adypuEmail: 'ananya.gupta@adypu.edu.in',
    linkedin: 'https://linkedin.com/in/ananya-gupta-7235a5319',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'des4',
    name: 'Vipul',
    role: 'Designer',
    avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=400',
    github: 'codervipul775',
    email: 'ydvvipul2005@gmail.com',
    adypuEmail: 'vipul.k@adypu.edu.in',
    linkedin: 'https://linkedin.com/in/vipul-yadav-b0a82231a/',
    devCoins: 0,
    contributions: [],
  },

  // Mobile App Developers
  {
    id: 'm1',
    name: 'Tanubhav',
    role: 'Mobile App Developer',
    avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=400',
    github: 'tanubhav',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'm2',
    name: 'Chiranjeev',
    role: 'Mobile App Developer',
    avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=400',
    github: 'chiranjeev',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'm3',
    name: 'Kanishk Kumar Ranjan',
    role: 'Mobile App Developer',
    avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=400',
    github: 'kanishk-kumar',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'm4',
    name: 'Daksh Saini',
    role: 'Mobile App Developer',
    avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=400',
    github: 'daksh-saini',
    devCoins: 0,
    contributions: [],
  },

  // Volunteers
  {
    id: 'v1',
    name: 'Yash Mali',
    role: 'Volunteer',
    avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=400',
    github: 'yash-mali',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'v2',
    name: 'Arpit Sarang',
    role: 'Volunteer',
    avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=400',
    github: 'arpit-sarang',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'v3',
    name: 'Kirti Gautam',
    role: 'Volunteer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    github: 'kirti-gautam',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'v4',
    name: 'Birajit Saikia',
    role: 'Volunteer',
    avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=400',
    github: 'birajit-saikia',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'v5',
    name: 'Ayush Pandey',
    role: 'Volunteer',
    avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=400',
    github: 'ayush-pandey',
    devCoins: 0,
    contributions: [],
  },
  {
    id: 'v6',
    name: 'Aditya Raj Soni',
    role: 'Volunteer',
    avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=400',
    github: 'aditya-raj-soni',
    devCoins: 0,
    contributions: [],
  },
];