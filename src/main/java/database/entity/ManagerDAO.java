package database.entity;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
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
		
		List<RestaurantLocation> restaurants = em
				.createNamedQuery("Restaurant.findRestaurantOwnedById")
				.setParameter("managerid", managerid).getResultList();
		return restaurants;

	}

	public Manager registerAdmin(Manager m) throws NoSuchAlgorithmException, InvalidKeySpecException {
		// TODO Auto-generated method stub
		String unHshedpassword = m.getPassword();
		
			m.setPassword(PasswordHash.createHash(unHshedpassword));
		
		if (!isExist(m)) {
			em.persist(m);
			return m;
		}

		return null;
	}
	
	public Manager validateUser(String credential, String password) throws NoSuchAlgorithmException, InvalidKeySpecException {
		// TODO Auto-generated method stub
		String imputPassword;
		
		List<String> passwords = (List<String>) em.createNamedQuery("Manager.findPassordByEmailOrUsername").setParameter("credential", credential).getResultList();
		if(passwords.isEmpty()){
			return null;
			//return "{\"result\":\"You are not in our database.\"}";
		}
		imputPassword = passwords.get(0);
		
		boolean correctPass = PasswordHash.validatePassword(password,imputPassword);
		if(!correctPass){
			return null;
			//return "{\"result\":\"The password you entered is incorrct.\"}";
		}
		List<Manager> managers = em.createNamedQuery("Manager.findManagerByEmailOrUsername").setParameter("credential", credential).getResultList();
		
		//+ "\"id\":" "{\"result\":\"success\","  +
		return managers.get(0);
		//return  gson.toJson(managers.get(0));
		
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

	
	public Manager getManagerByEmailOrUsername(String credential) {
		List<Manager> managers = em.createNamedQuery("Manager.findManagerByEmailOrUsername").setParameter("credential", credential).getResultList();
		if(!managers.isEmpty())
			return managers.get(0);
			
		return null;
		
	}
	
	public Manager getManagerById(int managerid) {
		// TODO Auto-generated method stub
		List<Manager> managers = em.createNamedQuery("Manager.findManagerById").setParameter("id", managerid).getResultList();
		if(!managers.isEmpty()){
			return managers.get(0);
		}
		return null;
	}
}
