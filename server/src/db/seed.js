import argon2 from "argon2";
import pool from "./pool.js";

const DEFAULT_PW = "password123";

const faculty = [
  { first: "Alan", last: "Turing",   email: "atur@faculty.kanvas.edu", teacher_number: "T-521834" },
  { first: "Barbara", last: "Liskov",email: "blis@faculty.kanvas.edu", teacher_number: "T-547210" },
  { first: "Donald", last: "Knuth",  email: "dknu@faculty.kanvas.edu", teacher_number: "T-563492" },
  { first: "Emmy", last: "Noether",  email: "enoe@faculty.kanvas.edu", teacher_number: "T-574118" },
  { first: "Grace", last: "Hopper",  email: "ghop@faculty.kanvas.edu", teacher_number: "T-589603" },
  { first: "Claude", last: "Shannon",email: "csha@faculty.kanvas.edu", teacher_number: "T-592471" },
  { first: "Hedy", last: "Lamarr",   email: "hlam@faculty.kanvas.edu", teacher_number: "T-603958" },
  { first: "John", last: "Backus",   email: "jbac@faculty.kanvas.edu", teacher_number: "T-615327" },
  { first: "Niklaus", last: "Wirth", email: "nwir@faculty.kanvas.edu", teacher_number: "T-628409" },
  { first: "Ada", last: "Lovelace",  email: "alov@faculty.kanvas.edu", teacher_number: "T-639175" },
];

const students = [
  ["Alice","Johnson","ajoh@kanvas.edu","CS","2025001"],
  ["Brian","Kim","bkim@kanvas.edu","STAT","2025002"],
  ["Chloe","Garcia","cgar@kanvas.edu","MATH","2025003"],
  ["Daniel","Davis","ddav@kanvas.edu","ENGR","2025004"],
  ["Emma","Anderson","eand@kanvas.edu","CS","2025005"],
  ["Felix","Thompson","ftho@kanvas.edu","STAT","2025006"],
  ["Gram","Hernandez","gher@kanvas.edu","MATH","2025007"],
  ["Henry","Martinez","hmar@kanvas.edu","ENGR","2025008"],
  ["Ivy","Jones","ijon@kanvas.edu","CS","2025009"],
  ["Jack","Khan","jkha@kanvas.edu","STAT","2025010"],
  ["Kara","Lopez","klop@kanvas.edu","MATH","2025011"],
  ["Liam","Wilson","lwil@kanvas.edu","ENGR","2025012"],
  ["Max","Clark","mcla@kanvas.edu","CS","2025013"],
  ["Noah","Lee","nlee@kanvas.edu","STAT","2025014"],
  ["Olivia","Allen","oall@kanvas.edu","MATH","2025015"],
  ["Parker","Patel","ppat@kanvas.edu","ENGR","2025016"],
  ["Quinn","Gutierrez","qgut@kanvas.edu","CS","2025017"],
  ["Riley","Wang","rwan@kanvas.edu","STAT","2025018"],
  ["Sophia","Moore","smoo@kanvas.edu","MATH","2025019"],
  ["Theo","Taylor","ttay@kanvas.edu","ENGR","2025020"],
  ["Ura","White","uwhi@kanvas.edu","CS","2025021"],
  ["Victor","Harris","vhar@kanvas.edu","STAT","2025022"],
  ["Willow","Robinson","wrob@kanvas.edu","MATH","2025023"],
  ["Xavier","Yang","xyan@kanvas.edu","ENGR","2025024"],
  ["Xara","Young","xyou@kanvas.edu","CS","2025025"],
  ["Zane","Zimmer","zzim@kanvas.edu","STAT","2025026"],
  ["Ava","Adams","aada@kanvas.edu","MATH","2025027"],
  ["Beau","Bell","bbel@kanvas.edu","ENGR","2025028"],
  ["Cora","Chan","ccha@kanvas.edu","CS","2025029"],
  ["Don","Diaz","ddia@kanvas.edu","STAT","2025030"],
];
