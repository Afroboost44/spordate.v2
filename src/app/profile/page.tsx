import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Camera, User } from "lucide-react";

export default function ProfilePage() {
    const userImage = PlaceHolderImages.find(p => p.id === 'profile-1');

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <Card className="bg-card border-border/20 shadow-lg shadow-accent/10">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">My Profile</CardTitle>
                        <CardDescription>Manage your public profile and preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <Avatar className="h-24 w-24">
                                    {userImage && <AvatarImage src={userImage.imageUrl} alt="User profile" data-ai-hint={userImage.imageHint} />}
                                    <AvatarFallback>
                                        <User className="h-12 w-12"/>
                                    </AvatarFallback>
                                </Avatar>
                                <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 bg-card hover:bg-accent border-accent/50">
                                    <Camera className="h-4 w-4"/>
                                    <span className="sr-only">Upload picture</span>
                                </Button>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Jessica</h2>
                                <p className="text-gray-400">jessica@example.com</p>
                            </div>
                        </div>

                        <form className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="full-name">Full Name</Label>
                                <Input id="full-name" defaultValue="Jessica" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" defaultValue="New York, NY" />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea id="bio" placeholder="Tell us about yourself and your sports journey." defaultValue="Tennis enthusiast looking for a regular practice partner. I also enjoy yoga and hiking on weekends."/>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sports">My Sports</Label>
                                <Input id="sports" placeholder="e.g. Tennis, Yoga, Running" defaultValue="Tennis, Yoga, Hiking, Running" />
                                <p className="text-xs text-gray-500">Separate sports with a comma.</p>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" className="bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] text-white font-semibold">Save Changes</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
