package database.entity;

import java.util.List;

import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
@Stateless
@LocalBean
@SuppressWarnings("unchecked")
public class MenuDAO {

	@PersistenceContext
	EntityManager em;
	
	public List<Menu> getMenu() {
		// TODO Auto-generated method stub
		List<Menu> m =  em.createNamedQuery("Menu.findById").getResultList();
		return m;
	}

}
