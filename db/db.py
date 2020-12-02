from flask_sqlalchemy import SQLAlchemy
from neo4j import GraphDatabase


db = SQLAlchemy()
graph_db = GraphDatabase.driver("neo4j://localhost:7687", auth=("neo4j", "password"))