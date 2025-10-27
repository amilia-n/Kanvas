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

