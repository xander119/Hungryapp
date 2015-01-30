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
public class CustomerDAO {
	@PersistenceContext
	EntityManager em;
	
	public boolean createCustomer(Customer c) throws NoSuchAlgorithmException, InvalidKeySpecException{
		if(c!=null){
			//hash password before store it.
			String unHshedpassword = c.getPassword();
			c.setPassword(PasswordHash.createHash(unHshedpassword));
			
			if(isCustomerExist(c.getUserName(),c.getEmail())){
				em.persist(c);
				return true;
			}else{
				return false;
			}
		}
		return false;
		
	}
	
	private boolean isCustomerExist(String username, String email){
		List<Customer> customers = em.createNamedQuery("Customer.validateEmailAndUsername").setParameter("username", username).setParameter("email", email).getResultList();
		if(customers.isEmpty()){
			return true;
		}
		return false;
	}
	
	public Customer updateCustomer(Customer c){
		
		return em.merge(c);
	}

	public String validateLoginUser(String credential, String password) throws NoSuchAlgorithmException, InvalidKeySpecException {
		// TODO Auto-generated method stub
		String imputPassword;
		List<Customer> customers = em.createNamedQuery("Customer.findPassordByEmailOrUsername").setParameter("credential", credential).getResultList();
		if(customers.isEmpty()){
			return "{\"result\":\"You are not in our database.\"}";
		}
		imputPassword = customers.get(0).getPassword();
		boolean correctPass = PasswordHash.validatePassword(password, imputPassword);
		if(!correctPass){
			return "{\"result\":\"The password you entered is incorrct.\"}";
		}
		return "{\"result\":\"success\"}";
		
	}
	
	public Customer getCustomerByID(int id) {
		// TODO Auto-generated method stub
		List<Customer> customers = em.createNamedQuery("Customer.findById").setParameter("id", id).getResultList();
		if (!customers.isEmpty()){
			return customers.get(0);
		}
		return null;
	}

	public List<Orders> getCustomerOrdersById(int userid) {
		// TODO Auto-generated method stub
		//List<Orders> orders = em.createNamedQuery("");
		return null;
	}
}
