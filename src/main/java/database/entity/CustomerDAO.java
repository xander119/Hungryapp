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
	
	private Customer loggedUser;
	private Emailsender email = new Emailsender();
	
	public Customer getLoggedUser() {
		return loggedUser;
	}

	public void setLoggedUser(Customer loggedUser) {
		this.loggedUser = loggedUser;
	}

	public boolean createCustomer(Customer c) throws NoSuchAlgorithmException, InvalidKeySpecException{
		String registerSuccessBody = "Dear Customer : \n"+"\n\t\tCongratulations You have successfully registered to Hungry. Welcome "+ c.getFirstname() + "! "
				+"\n \n \n" + " Kind Regards, Hungry Customer service";
		{
			//hash password before store it.
			String unHshedpassword = c.getPassword();
			c.setPassword(PasswordHash.createHash(unHshedpassword));
			
			if(isCustomerExist(c.getUsername(),c.getEmail())){
				em.persist(c);
				email.sendEmail(c.getEmail(), "New account Created! ", registerSuccessBody );
				return true;
			}else{
				return false;
			}
		}
		
		
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

	public Customer validateLoginUser(String credential, String password) throws NoSuchAlgorithmException, InvalidKeySpecException {
		// TODO Auto-generated method stub
		String imputPassword;
		
		List<String> passwords = (List<String>) em.createNamedQuery("Customer.findPassordByEmailOrUsername").setParameter("credential", credential).getResultList();
		if(passwords.isEmpty()){
			return  null; 
			//"{\"result\":\"You are not in our database.\"}";
		}
		imputPassword = passwords.get(0);
		
		boolean correctPass = PasswordHash.validatePassword(password,imputPassword);
		if(!correctPass){
			return null;
		}
		List<Customer> customers = em.createNamedQuery("Customer.findCustomerByEmailOrUsername").setParameter("credential", credential).getResultList();
		
			
		
		return customers.get(0);
		
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
		List<Orders> orders = em.createNamedQuery("Customer.findOrdersByUserid").setParameter("id", userid).getResultList();
		if(!orders.isEmpty()){
			return orders;
		}
		return null;
	}

	public boolean deleteCustomer(int userid) {
		// TODO Auto-generated method stub
		Customer removeCus = em.find(Customer.class, userid);
		if(removeCus!=null){
			em.remove(removeCus);
			return true;
		}
		else{
			return false;
		}
	}

	public String checkLoginUser(String credential) {
			
		
		return "{\"result\":\"notLogin\"}";
	}

	public Customer getCustomerByEmailOrUsername(String email) {
		// TODO Auto-generated method stub
		List<Customer> customers = em.createNamedQuery("Customer.findCustomerByEmailOrUsername").setParameter("credential", email).getResultList();
		if(!customers.isEmpty())
			return customers.get(0);
		return null;
	}

	public Address createAddress(Address a, int custId) {
		// TODO Auto-generated method stub
		
		Customer c = (Customer) em.createNamedQuery("Customer.findById").setParameter("id", custId).getResultList().get(0);
		a.setCustomer(c);
		a = em.merge(a);
		
		return a;
	}

	public Address deleteAddress(int addrId) {
		// TODO Auto-generated method stubaddrId
		Address a = (Address) em.createNamedQuery("Address.findById").setParameter("id", addrId).getResultList().get(0);
		try {
			em.remove(a);
			System.out.println(a.getLine1());
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			return null;
		}
		return a;
	}
	
	public Review saveReview(Review r, int custId,int locationId){
		Customer c = (Customer) em.createNamedQuery("Customer.findById").setParameter("id", custId).getResultList().get(0);
		RestaurantLocation rl = (RestaurantLocation) em.createNamedQuery("RestaurantLocation.findById").setParameter("id", locationId).getResultList().get(0);
		r.setCustomer(c);
		r.setRestaurantLocation(rl);
		r = em.merge(r);
		
		return r;
	}
	
	public Review deleteReview(int reviewId){
		Review r  = (Review) em.createNamedQuery("Review.findById").setParameter("id", reviewId).getResultList().get(0);
		em.remove(r);
		return r;
		
	}
	
	
	
	
	
	
}
