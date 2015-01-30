package database.entity;

import java.util.List;

import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Stateless
@LocalBean
@SuppressWarnings("unchecked")
public class ManagerDAO {
	@PersistenceContext
	EntityManager em;

	public List<Restaurant> getRestaurantById(int managerid) {
		// TODO Auto-generated method stub
		List<Restaurant> restaurants = em.create
		return null;
	}

	public Manager registerAdmin(Manager m) {
		// TODO Auto-generated method stub
		return null;
	}
}
