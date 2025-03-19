export interface Person {
  id: number;
  name: string;
  role: string;
  department: string;
  age: number;
  email: string;
  city: string;
  salary: number;
  joinDate: string;
  status: "active" | "vacation" | "resigned";
}

export const sampleData: Person[] = [
  {
    id: 1,
    name: "김철수",
    role: "프론트엔드 개발자",
    department: "개발팀",
    age: 28,
    email: "kim@example.com",
    city: "서울",
    salary: 45000000,
    joinDate: "2022-03-15",
    status: "active",
  },
  {
    id: 2,
    name: "이영희",
    role: "백엔드 개발자",
    department: "개발팀",
    age: 32,
    email: "lee@example.com",
    city: "부산",
    salary: 52000000,
    joinDate: "2021-08-22",
    status: "vacation",
  },
  {
    id: 3,
    name: "박지민",
    role: "백엔드 개발자",
    department: "개발팀",
    age: 25,
    email: "park@example.com",
    city: "대구",
    salary: 38000000,
    joinDate: "2023-01-10",
    status: "active",
  },
  {
    id: 4,
    name: "정민수",
    role: "백엔드 개발자",
    department: "개발팀",
    age: 35,
    email: "jung@example.com",
    city: "인천",
    salary: 58000000,
    joinDate: "2024-05-18",
    status: "active",
  },
  {
    id: 5,
    name: "최유나",
    role: "백엔드 개발자",
    department: "개발팀",
    age: 29,
    email: "choi@example.com",
    city: "광주",
    salary: 47000000,
    joinDate: "2024-05-18",
    status: "active",
  },
];
