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

	public List<RestaurantLocation> getRestaurantByManagerId(int managerid) {
		// TODO Auto-generated method stub
		Manager m = em.find(Manager.class, managerid);
		List<RestaurantLocation> restaurants = em
				.createNamedQuery("Manager.findRestaurantOwnedById")
				.setParameter("manager", m).getResultList();
		return restaurants;

	}

	public Manager registerAdmin(Manager m) {
		// TODO Auto-generated method stub
		if (!isExist(m)) {
			em.persist(m);
			return m;
		}

		return null;
	}

	private boolean isExist(Manager m) {
		List<Manager> managers = em.createNamedQuery("Manager.allManagers")
				.getResultList();
		for (Manager manager : managers) {
			if (manager.getName().equals(m.getName())) {
				return true;
			}
		}

		return false;

	}
}
