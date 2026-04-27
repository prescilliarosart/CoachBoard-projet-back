import type { ResultSetHeader, RowDataPacket } from "mysql2";
import client from "../../database/client.js";

export const findAll = async () => {
	const [rows] = await client.query<RowDataPacket[]>("SELECT * FROM SUIVI");
	return rows;
};

export const findById = async (id: string) => {
	const [rows] = await client.query<RowDataPacket[]>(
		"SELECT * FROM SUIVI WHERE ID_SUIVI = ?",
		[id],
	);
	return rows[0] as RowDataPacket | undefined;
};

export const findBySeance = async (id: string) => {
	const [rows] = await client.query<RowDataPacket[]>(
		"SELECT * FROM SUIVI WHERE id_seance = ?",
		[id],
	);
	return rows as RowDataPacket[];
};

export const findByDate = async (date: string) => {
	const [rows] = await client.query<RowDataPacket[]>(
		"SELECT * FROM SUIVI WHERE date = ?",
		[date],
	);
	return rows as RowDataPacket[];
};

export const findByEleve = async (idEleve: string) => {
	const [rows] = await client.query<RowDataPacket[]>(
		`SELECT 
			s.*,
			e.NOM as nom_eleve,
			e.PRENOM as prenom_eleve,
			ex.NOM as nom_exercice,
			se.TITRE as titre_seance
		FROM SUIVI s
		JOIN ELEVES_PROGRAMMES ep ON s.ID_ELEVE_PROGRAMME = ep.ID_ELEVE_PROGRAMME
		JOIN ELEVES e ON ep.ID_ELEVE = e.ID_ELEVE
		JOIN SEANCES se ON s.ID_SEANCE = se.ID_SEANCE
		JOIN SEANCES_EXERCICES sex ON s.ID_SEANCES_EXERCICES = sex.ID_SEANCES_EXERCICES
		JOIN EXERCICES ex ON sex.ID_EXERCICE = ex.ID_EXERCICE
		WHERE ep.ID_ELEVE = ?`,
		[idEleve],
	);
	return rows as RowDataPacket[];
};

export const create = async (
	charge_soulevee: number,
	reps_reelle: number,
	poids_corporel: number,
	ressenti: string,
	commentaires: string,
	date: string,
	statut: string,
	id_seance: number,
	id_seances_exercices: number,
	id_eleve_programme: number,
) => {
	const [result] = await client.query<ResultSetHeader>(
		"INSERT INTO SUIVI (charge_soulevee, reps_reelle, poids_corporel, ressenti, commentaires, date, statut, id_seance, id_seances_exercices, id_eleve_programme) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		[
			charge_soulevee,
			reps_reelle,
			poids_corporel,
			ressenti,
			commentaires,
			date,
			statut,
			id_seance,
			id_seances_exercices,
			id_eleve_programme,
		],
	);
	return result.insertId;
};

export const update = async (
	id: string,
	charge_soulevee: number,
	reps_reelle: number,
	poids_corporel: number,
	ressenti: string,
	commentaires: string,
	date: string,
	statut: string,
	id_seance: number,
	id_seances_exercices: number,
	id_eleve_programme: number,
) => {
	const [result] = await client.query<ResultSetHeader>(
		"UPDATE SUIVI SET charge_soulevee = ?, reps_reelle = ?, poids_corporel = ?, ressenti = ?, commentaires = ?, date = ?, statut = ?, id_seance = ?, id_seances_exercices = ?, id_eleve_programme = ? WHERE id_suivi = ?",
		[
			charge_soulevee,
			reps_reelle,
			poids_corporel,
			ressenti,
			commentaires,
			date,
			statut,
			id_seance,
			id_seances_exercices,
			id_eleve_programme,
			id,
		],
	);
	return result.affectedRows > 0;
};

export const destroy = async (id: string) => {
	const [result] = await client.query<ResultSetHeader>(
		"DELETE FROM SUIVI WHERE id_suivi = ?",
		[id],
	);
	return result.affectedRows > 0;
};

export const destroyByEleveProgramme = async (id: string) => {
	const [result] = await client.query<ResultSetHeader>(
		"DELETE FROM SUIVI WHERE id_eleve_programme = ?",
		[id],
	);
	return result.affectedRows > 0;
};

export const checkDejaRealisee = async (
	id_seance: string,
	date: string,
	id_eleve_programme: string,
) => {
	const [rows] = await client.query<RowDataPacket[]>(
		"SELECT COUNT(*) as total FROM SUIVI WHERE id_seance = ? AND date = ? AND id_eleve_programme = ?",
		[id_seance, date, id_eleve_programme],
	);
	return (rows[0] as RowDataPacket).total > 0;
};
