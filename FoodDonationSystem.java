// Filename: FoodDonationSystem.java
import java.util.*;
import java.time.LocalDateTime;

class Donation {
    private String id;
    private String donorName;
    private String foodType;
    private int quantity;
    private String location;
    private LocalDateTime timestamp;
    private String status;

    public Donation(String donorName, String foodType, int quantity, String location) {
        this.id = UUID.randomUUID().toString().substring(0, 8);
        this.donorName = donorName;
        this.foodType = foodType;
        this.quantity = quantity;
        this.location = location;
        this.timestamp = LocalDateTime.now();
        this.status = "Available";
    }

    // Getters
    public String getId() { return id; }
    public String getDonorName() { return donorName; }
    public String getFoodType() { return foodType; }
    public int getQuantity() { return quantity; }
    public String getLocation() { return location; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public String getStatus() { return status; }
    
    public void setStatus(String status) { this.status = status; }

    @Override
    public String toString() {
        return String.format("ID: %s | Donor: %s | Food: %s | Qty: %d | Location: %s | Status: %s", 
                           id, donorName, foodType, quantity, location, status);
    }
}

public class FoodDonationSystem {
    private List<Donation> donations;
    private Scanner scanner;

    public FoodDonationSystem() {
        donations = new ArrayList<>();
        scanner = new Scanner(System.in);
    }

    public void addDonation(String donorName, String foodType, int quantity, String location) {
        Donation donation = new Donation(donorName, foodType, quantity, location);
        donations.add(donation);
        System.out.println("Donation added successfully! ID: " + donation.getId());
    }

    public void viewDonations() {
        if (donations.isEmpty()) {
            System.out.println("No donations available.");
            return;
        }
        
        System.out.println("\n=== Available Donations ===");
        for (Donation donation : donations) {
            if (donation.getStatus().equals("Available")) {
                System.out.println(donation);
            }
        }
    }

    public void claimDonation(String donationId) {
        for (Donation donation : donations) {
            if (donation.getId().equals(donationId) && donation.getStatus().equals("Available")) {
                donation.setStatus("Claimed");
                System.out.println("Donation claimed successfully!");
                return;
            }
        }
        System.out.println("Donation not found or already claimed.");
    }

    public void searchByLocation(String location) {
        System.out.println("\n=== Donations in " + location + " ===");
        boolean found = false;
        for (Donation donation : donations) {
            if (donation.getLocation().toLowerCase().contains(location.toLowerCase()) 
                && donation.getStatus().equals("Available")) {
                System.out.println(donation);
                found = true;
            }
        }
        if (!found) {
            System.out.println("No donations found in this location.");
        }
    }

    public void showMenu() {
        while (true) {
            System.out.println("\n=== Food Donation System ===");
            System.out.println("1. Add Donation");
            System.out.println("2. View All Donations");
            System.out.println("3. Claim Donation");
            System.out.println("4. Search by Location");
            System.out.println("5. Exit");
            System.out.print("Choose option: ");

            int choice = scanner.nextInt();
            scanner.nextLine(); // consume newline

            switch (choice) {
                case 1:
                    System.out.print("Enter donor name: ");
                    String name = scanner.nextLine();
                    System.out.print("Enter food type: ");
                    String food = scanner.nextLine();
                    System.out.print("Enter quantity: ");
                    int qty = scanner.nextInt();
                    scanner.nextLine();
                    System.out.print("Enter location: ");
                    String loc = scanner.nextLine();
                    addDonation(name, food, qty, loc);
                    break;
                case 2:
                    viewDonations();
                    break;
                case 3:
                    System.out.print("Enter donation ID to claim: ");
                    String id = scanner.nextLine();
                    claimDonation(id);
                    break;
                case 4:
                    System.out.print("Enter location to search: ");
                    String searchLoc = scanner.nextLine();
                    searchByLocation(searchLoc);
                    break;
                case 5:
                    System.out.println("Thank you for using Food Donation System!");
                    return;
                default:
                    System.out.println("Invalid option!");
            }
        }
    }

    public static void main(String[] args) {
        FoodDonationSystem system = new FoodDonationSystem();
        system.showMenu();
    }
}