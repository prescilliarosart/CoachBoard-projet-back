import type { ResultSetHeader, RowDataPacket } from "mysql2";
import client from "../../database/client.js";

export const findAll = async () => {
	const [rows] = await client.query<RowDataPacket[]>(
		"SELECT * FROM ELEVES_PROGRAMMES",
	);
	return rows;
};

export const findById = async (id: string) => {
	const [rows] = await client.query<RowDataPacket[]>(
		"SELECT * FROM ELEVES_PROGRAMMES WHERE ID_ELEVE_PROGRAMME = ?",
		[id],
	);
	return rows[0] as RowDataPacket | undefined;
};

export const findByEleve = async (id: string) => {
	const [rows] = await client.query<RowDataPacket[]>(
		`SELECT ep.ID_ELEVE_PROGRAMME, ep.DATE_DEBUT, ep.DATE_FIN, ep.STATUT,
		ep.ID_PROGRAMME,
            p.NOM, p.OBJECTIF, p.DUREE
     FROM ELEVES_PROGRAMMES ep
     JOIN PROGRAMMES p ON ep.ID_PROGRAMME = p.ID_PROGRAMME
     WHERE ep.ID_ELEVE = ?`,
		[id],
	);
	return rows as RowDataPacket[];
};

export const findByProgramme = async (id: string) => {
	const [rows] = await client.query<RowDataPacket[]>(
		"SELECT * FROM ELEVES_PROGRAMMES WHERE id_programme = ?",
		[id],
	);
	return rows as RowDataPacket[];
};

export const create = async (
	date_debut: string,
	statut: string,
	date_fin: string,
	id_eleve: number,
	id_programme: number,
) => {
	const [result] = await client.query<ResultSetHeader>(
		"INSERT INTO ELEVES_PROGRAMMES (date_debut, statut, date_fin, id_eleve, id_programme) VALUES (?, ?, ?, ?, ?)",
		[date_debut, statut, date_fin, id_eleve, id_programme],
	);
	return result.insertId;
};

export const update = async (
	id: string,
	date_debut: string,
	statut: string,
	date_fin: string,
	id_eleve: number,
	id_programme: number,
) => {
	const [result] = await client.query<ResultSetHeader>(
		"UPDATE ELEVES_PROGRAMMES SET date_debut = ?, statut = ?, date_fin = ?, id_eleve = ?, id_programme = ? WHERE ID_ELEVE_PROGRAMME = ?",
		[date_debut, statut, date_fin, id_eleve, id_programme, id],
	);
	return result.affectedRows > 0;
};

export const destroy = async (id: string) => {
	const [result] = await client.query<ResultSetHeader>(
		"DELETE FROM ELEVES_PROGRAMMES WHERE id_eleve_programme = ?",
		[id],
	);
	return result.affectedRows > 0;
};
