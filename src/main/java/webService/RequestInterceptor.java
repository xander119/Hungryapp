package webService;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.List;
import java.util.Set;
import java.util.StringTokenizer;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.core.HttpHeaders;

import org.jboss.resteasy.util.Base64;

import database.entity.Customer;
import database.entity.CustomerDAO;
import database.entity.Manager;
import database.entity.ManagerDAO;

@Stateless
public class RequestInterceptor{
	private static final String AUTHORIZATION_PROPERTY = "Authorization";
	private static final String AUTHENTICATION_SCHEME = "Basic";
	
	@EJB
	private ManagerDAO managerDao;
	@EJB
	private CustomerDAO customerDao;


	private boolean isUserAllowed(final String credential, final String password,final Set<String> rolesSet) 
	{
		boolean isAllowed = false;
		String userRole = null;
		Manager managerResult = null ;
		Customer customerResult = null;
		
		
		try {
			if(rolesSet.contains("customer")){
				customerResult = customerDao.validateLoginUser(credential,password);
			}else{
				managerResult = managerDao.validateUser(credential,password);
			}
			 
			 
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InvalidKeySpecException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if(managerResult!=null){
			 userRole = "admin";
			 System.out.print(managerResult.getName());
		}else if(customerResult!=null){
			 userRole = "customer";
			 System.out.println(customerResult.getEmail());
		}
		//Verify user role
		if(rolesSet.contains(userRole))
		{
			isAllowed = true;
		}else{
			isAllowed = false;
		}
		return isAllowed;
	}

	public boolean process(Set<String> rolesSet, HttpHeaders hHeaders )  {
		// Fetch authorization header
		final List<String> authorization = hHeaders.getRequestHeader(AUTHORIZATION_PROPERTY);
	
			// If no authorization information present; block access
			if (authorization == null || authorization.isEmpty()) {
				return false;
			}
			// Get encoded details
			final String encodedUserPassword = authorization.get(0)
					.replaceFirst(AUTHENTICATION_SCHEME + " ", "");
			// Decode
			String usernameAndPassword = null;
			try {
				usernameAndPassword = new String(Base64.decode(encodedUserPassword));
			} catch (IOException e) {
				// requestContext.abortWith();
				return false;
			}

			// Split username and password tokens
			final StringTokenizer tokenizer = new StringTokenizer(usernameAndPassword, ":");
			final String username = tokenizer.nextToken();
			final String password = tokenizer.nextToken();
			

			// Validate access

			if (!isUserAllowed(username, password, rolesSet)) {
				return false;
			}else{
				return true;
			}

		}
	
		

	}
