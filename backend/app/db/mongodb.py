"""
Ce module réexporte les fonctions de database.py pour maintenir la compatibilité
avec les services qui importent depuis app.db.mongodb
"""
from .database import get_database, connect_to_mongo, close_mongo_connection, db

__all__ = ["get_database", "connect_to_mongo", "close_mongo_connection", "db"]
