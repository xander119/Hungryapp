package database.entity;

import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Stateless
@LocalBean
@SuppressWarnings("unchecked")
public class ItemDAO {
	@PersistenceContext
	EntityManager em;
}
